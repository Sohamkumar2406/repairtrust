import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Fetch metrics in parallel
    const [
      customersRes,
      techsRes,
      verifiedTechsRes,
      pendingTechsRes,
      requestsRes,
      bookingsRes,
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "customer"),
      supabase.from("technician_profiles").select("id", { count: "exact", head: true }),
      supabase.from("technician_profiles").select("id", { count: "exact", head: true }).eq("verification_status", "verified"),
      supabase.from("technician_profiles").select("id", { count: "exact", head: true }).eq("verification_status", "pending"),
      supabase.from("service_requests").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("id, final_amount, booking_status"),
    ]);

    const totalCustomers = customersRes.count || 0;
    const totalTechnicians = techsRes.count || 0;
    const verifiedTechnicians = verifiedTechsRes.count || 0;
    const pendingKYC = pendingTechsRes.count || 0;
    const totalRequests = requestsRes.count || 0;

    const bookingsList = bookingsRes.data || [];
    const totalBookings = bookingsList.length;
    const totalGMV = bookingsList.reduce((sum, b) => sum + (Number(b.final_amount) || 0), 0);
    const platformCommission = Math.round(totalGMV * 0.12);

    return NextResponse.json({
      success: true,
      stats: {
        totalCustomers,
        totalTechnicians,
        verifiedTechnicians,
        pendingKYC,
        totalRequests,
        totalBookings,
        totalGMV,
        platformCommission,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
