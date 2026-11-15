import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createBookingFromQuote,
  getCustomerBookings,
  getTechnicianBookings,
  updateBookingStatus,
} from "@/lib/services/bookings.service";
import { acceptQuoteSchema, updateBookingStatusSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const requestedRole = searchParams.get("role");

  // Check if technician profile exists
  const { data: tech } = await supabase
    .from("technician_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (requestedRole === "technician" && tech) {
    const { data, error } = await getTechnicianBookings(tech.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } else {
    const { data, error } = await getCustomerBookings(user.id);
    if (error) return NextResponse.json({ success: false, error }, { status: 500 });
    return NextResponse.json({ success: true, data });
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please sign in to accept quotation." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { quoteId, scheduledAt } = acceptQuoteSchema.parse(body);

    const { data, error } = await createBookingFromQuote(quoteId, user.id, scheduledAt);
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { bookingId, newStatus, notes } = updateBookingStatusSchema.parse(body);

    const { success, error } = await updateBookingStatus(
      bookingId,
      user.id,
      newStatus,
      notes
    );

    if (!success) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Status updated to ${newStatus}` });
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
