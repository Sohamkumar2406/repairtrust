import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        id,
        scheduled_at,
        booking_status,
        final_amount,
        completion_date,
        created_at,
        customer:profiles!bookings_customer_id_fkey(id, full_name, phone, email),
        technician:technician_profiles!bookings_technician_id_fkey(
          id,
          business_name,
          average_rating,
          profile:profiles!technician_profiles_user_id_fkey(full_name, phone)
        ),
        request:service_requests!bookings_request_id_fkey(
          title,
          category:service_categories(name, slug),
          address:customer_addresses(address_line, area, pincode)
        ),
        warranty:warranties(warranty_period_days, warranty_end_date, warranty_status),
        review:reviews(rating, review_text)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback query if deep nested aliases have constraint issues
      const { data: simpleBookings, error: simpleErr } = await supabase
        .from("bookings")
        .select(`
          id,
          scheduled_at,
          booking_status,
          final_amount,
          completion_date,
          created_at,
          request:service_requests(title, category:service_categories(name)),
          customer:profiles(full_name, phone)
        `)
        .order("created_at", { ascending: false });

      if (simpleErr) {
        return NextResponse.json({ success: false, error: simpleErr.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: simpleBookings || [] });
    }

    return NextResponse.json({ success: true, data: bookings || [] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch admin bookings" },
      { status: 500 }
    );
  }
}
