import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createReviewSchema } from "@/lib/validations/bookings";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to submit a review." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookingId, rating, reviewText } = createReviewSchema.parse(body);

    // Verify booking belongs to customer
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select("id, customer_id, technician_id, booking_status")
      .eq("id", bookingId)
      .single();

    if (bookingErr || !booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.customer_id !== user.id) {
      return NextResponse.json(
        { success: false, error: "You can only review your own bookings." },
        { status: 403 }
      );
    }

    // Insert review
    const { data: review, error: reviewErr } = await supabase
      .from("reviews")
      .insert({
        booking_id: bookingId,
        customer_id: user.id,
        technician_id: booking.technician_id,
        rating,
        review_text: reviewText || null,
        is_verified_booking: true,
      })
      .select()
      .single();

    if (reviewErr) {
      return NextResponse.json(
        { success: false, error: reviewErr.message || "Failed to submit review" },
        { status: 400 }
      );
    }

    // Update technician average rating (optional aggregation)
    try {
      const { data: allReviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("technician_id", booking.technician_id);

      if (allReviews && allReviews.length > 0) {
        const avg =
          allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await supabase
          .from("technician_profiles")
          .update({
            average_rating: parseFloat(avg.toFixed(2)),
            total_jobs: allReviews.length,
            updated_at: new Date().toISOString(),
          })
          .eq("id", booking.technician_id);
      }
    } catch (e) {
      console.warn("Technician rating update notice:", e);
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: "Thank you! Your verified review has been published.",
    });
  } catch (err: any) {
    if (err.errors) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: err.errors },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process review" },
      { status: 500 }
    );
  }
}
