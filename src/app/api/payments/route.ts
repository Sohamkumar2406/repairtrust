import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "bookingId is required" },
        { status: 400 }
      );
    }

    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, payment });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch payment" },
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
        { success: false, error: "Unauthorized. Please login to complete payment." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      bookingId,
      amount,
      paymentMethod = "upi",
      upiId,
      notes,
    } = body;

    if (!bookingId || !amount) {
      return NextResponse.json(
        { success: false, error: "bookingId and amount are required" },
        { status: 400 }
      );
    }

    // Verify booking
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select("id, customer_id, technician_id, final_amount, booking_status")
      .eq("id", bookingId)
      .single();

    if (bookingErr || !booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    const paymentAmount = Number(amount) || Number(booking.final_amount);
    const gatewayPaymentId = `PAY-RT-${Date.now().toString().slice(-8)}`;
    const gatewayOrderId = `ORD-${bookingId.slice(0, 8).toUpperCase()}`;

    // 1. Insert Payment
    const { data: payment, error: payErr } = await supabase
      .from("payments")
      .insert({
        booking_id: bookingId,
        customer_id: booking.customer_id,
        amount: paymentAmount,
        currency: "INR",
        payment_method: paymentMethod,
        payment_gateway: paymentMethod === "cash" ? "cash_doorstep" : "doorstep_upi",
        gateway_order_id: gatewayOrderId,
        gateway_payment_id: gatewayPaymentId,
        payment_status: "captured",
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (payErr) {
      return NextResponse.json({ success: false, error: payErr.message }, { status: 500 });
    }

    // 2. Insert or update platform commission (12% take-rate)
    const commissionPercentage = 12.0;
    const commissionAmount = Math.round(paymentAmount * 0.12 * 100) / 100;
    const technicianPayout = Math.round((paymentAmount - commissionAmount) * 100) / 100;

    try {
      await supabase.from("platform_commissions").insert({
        booking_id: bookingId,
        technician_id: booking.technician_id,
        commission_percentage: commissionPercentage,
        commission_amount: commissionAmount,
        technician_payout: technicianPayout,
        payout_status: "pending",
      });
    } catch (e) {
      console.warn("Commission record notice:", e);
    }

    // 3. Notification for payment receipt
    try {
      await supabase.from("notifications").insert({
        user_id: booking.customer_id,
        title: "Payment Received Successfully",
        message: `Your payment of ₹${paymentAmount} for booking #${bookingId.slice(0, 8)} was received via ${paymentMethod.toUpperCase()}. Your 60-day digital warranty is active!`,
        notification_type: "booking_update",
        metadata: { bookingId, paymentId: payment.id },
      });
    } catch (e) {
      console.warn("Notification record notice:", e);
    }

    return NextResponse.json({
      success: true,
      payment,
      receipt: {
        paymentId: payment.id,
        transactionRef: gatewayPaymentId,
        amount: paymentAmount,
        paymentMethod,
        paidAt: payment.paid_at,
        commissionAmount,
        technicianPayout,
      },
      message: "Payment recorded successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process payment" },
      { status: 500 }
    );
  }
}
