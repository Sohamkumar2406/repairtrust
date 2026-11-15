import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    let query = supabase
      .from("disputes")
      .select(`
        id,
        booking_id,
        issue_type,
        description,
        dispute_status,
        resolution_notes,
        created_at,
        booking:bookings(
          final_amount,
          scheduled_at,
          request:service_requests(title, category:service_categories(name))
        )
      `)
      .order("created_at", { ascending: false });

    if (bookingId) {
      query = query.eq("booking_id", bookingId);
    } else {
      query = query.eq("customer_id", user.id);
    }

    const { data: claims, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: claims || [] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch warranty claims" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to raise a warranty claim." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookingId, symptom = "recurrent_fault", description, preferredSlot } = body;

    if (!bookingId || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Booking ID and issue description are required." },
        { status: 400 }
      );
    }

    // 1. Verify booking
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select(`
        id,
        customer_id,
        technician_id,
        booking_status,
        completion_date,
        created_at,
        request:service_requests(title)
      `)
      .eq("id", bookingId)
      .single();

    if (bookingErr || !booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    if (booking.customer_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "You can only claim warranty for your own completed bookings." },
        { status: 403 }
      );
    }

    // 2. Check warranty validity (within 60 days of completion)
    const completionDate = booking.completion_date
      ? new Date(booking.completion_date)
      : new Date(booking.created_at);
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysElapsed > 60) {
      return NextResponse.json(
        {
          success: false,
          error: `Warranty period has expired (${daysElapsed} days since completion. Protection limit is 60 days).`,
        },
        { status: 400 }
      );
    }

    const claimDetails = `[${symptom.toUpperCase()}] ${description.trim()} • Preferred Slot: ${preferredSlot || "Urgent Morning"}`;
    const claimTicketRef = `CLM-RT-${Date.now().toString().slice(-6)}`;

    // 3. Insert into disputes table
    const { data: dispute, error: disputeErr } = await supabase
      .from("disputes")
      .insert({
        booking_id: bookingId,
        customer_id: user.id,
        technician_id: booking.technician_id,
        issue_type: "warranty_claim",
        description: claimDetails,
        dispute_status: "opened",
        resolution_notes: `Claim ticket: ${claimTicketRef} • 100% Free Doorstep Re-visit requested.`,
      })
      .select()
      .single();

    if (disputeErr) {
      return NextResponse.json(
        { success: false, error: disputeErr.message || "Failed to register warranty claim." },
        { status: 500 }
      );
    }

    // 4. Update warranty status to 'claimed'
    try {
      await supabase
        .from("warranties")
        .update({
          warranty_status: "claimed",
          updated_at: new Date().toISOString(),
        })
        .eq("booking_id", bookingId);
    } catch (e) {
      console.warn("Warranty record status update note:", e);
    }

    // 5. Send customer notification
    try {
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "60-Day Guarantee Claim Registered",
        message: `Your free doorstep re-inspection request (${claimTicketRef}) has been assigned to your technician under RepairTrust Protection.`,
        notification_type: "warranty_claimed",
        metadata: { bookingId, disputeId: dispute.id, ticketRef: claimTicketRef },
      });
    } catch (e) {
      console.warn("Notification notice:", e);
    }

    return NextResponse.json({
      success: true,
      claimTicketRef,
      dispute,
      message: "Your 60-day warranty claim has been registered! A free doorstep re-visit is being scheduled.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process warranty claim" },
      { status: 500 }
    );
  }
}
