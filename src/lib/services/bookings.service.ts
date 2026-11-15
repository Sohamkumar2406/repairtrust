import { createClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/client";
import { Database, BookingStatus } from "../supabase/types";

export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];

export async function createBookingFromQuote(
  quoteId: string,
  customerId: string,
  scheduledAt: string
): Promise<{
  data: BookingRow | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();

    // 1. Fetch quote details
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*, request:service_requests(*)")
      .eq("id", quoteId)
      .single();

    if (quoteError || !quote) {
      return { data: null, error: quoteError?.message || "Quote not found" };
    }

    // 2. Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        request_id: quote.request_id,
        quote_id: quote.id,
        customer_id: customerId,
        technician_id: quote.technician_id,
        scheduled_at: scheduledAt,
        booking_status: "confirmed",
        final_amount: quote.total_amount,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      return { data: null, error: bookingError?.message || "Failed to create booking" };
    }

    // 3. Mark accepted quote & reject other quotes on this request
    await supabase
      .from("quotes")
      .update({ quote_status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", quote.id);

    await supabase
      .from("quotes")
      .update({ quote_status: "rejected", updated_at: new Date().toISOString() })
      .eq("request_id", quote.request_id)
      .neq("id", quote.id);

    // 4. Update request status
    await supabase
      .from("service_requests")
      .update({ request_status: "booked", updated_at: new Date().toISOString() })
      .eq("id", quote.request_id);

    // 5. Log status history
    await supabase.from("booking_status_history").insert({
      booking_id: booking.id,
      old_status: null,
      new_status: "confirmed",
      changed_by: customerId,
      notes: "Booking confirmed by customer",
    });

    return { data: booking, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to book repair" };
  }
}

export async function getCustomerBookings(customerId: string): Promise<{
  data: any[] | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        request:service_requests(title, category:service_categories(name, slug, icon)),
        technician:technician_profiles(
          id,
          business_name,
          average_rating,
          profile:profiles(full_name, avatar_url, phone)
        ),
        payment:payments(amount, payment_status),
        warranty:warranties(warranty_period_days, warranty_end_date, warranty_status),
        review:reviews(id, rating)
      `)
      .eq("customer_id", customerId)
      .order("scheduled_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch bookings" };
  }
}

export async function getTechnicianBookings(technicianId: string): Promise<{
  data: any[] | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        request:service_requests(
          title,
          description,
          category:service_categories(name),
          address:customer_addresses(address_line, area, pincode)
        ),
        customer:profiles(full_name, phone, avatar_url),
        payment:payments(payment_status, amount)
      `)
      .eq("technician_id", technicianId)
      .order("scheduled_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch technician bookings" };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  userId: string,
  newStatus: BookingStatus,
  notes?: string | null
): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();

    // 1. Get current status and details
    const { data: current, error: getErr } = await supabase
      .from("bookings")
      .select("*, request:service_requests(category_id)")
      .eq("id", bookingId)
      .single();

    if (getErr || !current) return { success: false, error: "Booking not found" };

    // 2. Update status
    const updatePayload: any = {
      booking_status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "completed") {
      updatePayload.completion_date = new Date().toISOString();
    }

    const { error: updateErr } = await supabase
      .from("bookings")
      .update(updatePayload)
      .eq("id", bookingId);

    if (updateErr) return { success: false, error: updateErr.message };

    // 3. Log history
    await supabase.from("booking_status_history").insert({
      booking_id: bookingId,
      old_status: current.booking_status,
      new_status: newStatus,
      changed_by: userId,
      notes: notes || null,
    });

    // 4. If completed, update request status and issue warranty
    if (newStatus === "completed") {
      await supabase
        .from("service_requests")
        .update({ request_status: "completed", updated_at: new Date().toISOString() })
        .eq("id", current.request_id);

      const today = new Date();
      const startDate = today.toISOString().split("T")[0];
      const endDateObj = new Date(today);
      endDateObj.setDate(endDateObj.getDate() + 60);
      const endDate = endDateObj.toISOString().split("T")[0];

      await supabase.from("warranties").upsert(
        {
          booking_id: bookingId,
          customer_id: current.customer_id,
          technician_id: current.technician_id,
          warranty_period_days: 60,
          warranty_start_date: startDate,
          warranty_end_date: endDate,
          warranty_terms: "RepairTrust 60-Day Guarantee. Free doorstep re-inspection and parts rework.",
          warranty_status: "active",
        },
        { onConflict: "booking_id" }
      );

      // Notify customer
      await supabase.from("notifications").insert({
        user_id: current.customer_id,
        title: "Service Completed & Warranty Issued",
        message: "Your repair has been marked complete. A 60-Day Digital Warranty Certificate is active on your dashboard.",
        notification_type: "warranty_issued",
        is_read: false,
      });
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update booking status" };
  }
}
