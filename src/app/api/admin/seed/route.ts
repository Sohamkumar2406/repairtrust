import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Get or verify category
    const { data: categories } = await supabase
      .from("service_categories")
      .select("id, name, slug")
      .limit(5);

    const acCategory = categories?.find((c) => c.slug === "ac-repair") || categories?.[0];
    const wmCategory = categories?.find((c) => c.slug === "washing-machine-repair") || categories?.[1] || acCategory;

    // 2. Ensure verified technician partners in technician_profiles
    const { data: existingTechs } = await supabase
      .from("technician_profiles")
      .select("id, business_name, verification_status")
      .limit(5);

    let primaryTechId = existingTechs?.[0]?.id;

    if (existingTechs && existingTechs.length > 0) {
      // Update existing technician to have premium stats
      await supabase
        .from("technician_profiles")
        .update({
          business_name: "Ramesh AC & Appliance Care",
          experience_years: 9,
          bio: "Certified HVAC & home appliance specialist serving Koramangala, Indiranagar, and HSR Layout. 100% background checked with 60-day doorstep warranty.",
          verification_status: "verified",
          average_rating: 4.95,
          total_jobs: 148,
          availability_status: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingTechs[0].id);
      primaryTechId = existingTechs[0].id;
    }

    // 3. Seed open service requests (Bengaluru leads) if none exist
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: openRequests } = await supabase
      .from("service_requests")
      .select("id")
      .eq("request_status", "open")
      .limit(2);

    let seededLeadsCount = 0;

    let targetCustomerId = user?.id;
    if (!targetCustomerId) {
      const { data: anyProfile } = await supabase
        .from("profiles")
        .select("id")
        .limit(1)
        .maybeSingle();
      targetCustomerId = anyProfile?.id;
    }

    if ((!openRequests || openRequests.length === 0) && targetCustomerId && acCategory) {
      // Create demo customer address in Koramangala
      const { data: address } = await supabase
        .from("customer_addresses")
        .insert({
          customer_id: targetCustomerId,
          address_line: "Flat 302, Green Glen Layout, 80 Feet Road",
          area: "Koramangala",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560034",
          is_default: true,
        })
        .select("id")
        .single();

      if (address) {
        const today = new Date().toISOString().split("T")[0];

        // Lead 1: AC Cooling Issue
        await supabase.from("service_requests").insert({
          customer_id: targetCustomerId,
          category_id: acCategory.id,
          address_id: address.id,
          title: "Split AC Gas Leakage & Low Cooling Inspection",
          description: "1.5 Ton Split AC is blowing normal air. Compressor turns on but cooling is very weak. Need quick diagnostic and gas pressure check.",
          problem_details: {
            appliance: "Split AC 1.5 Ton",
            brand: "Daikin",
            symptom: "Weak cooling & refrigerant refill needed",
            locality: "Koramangala",
          },
          preferred_date: today,
          preferred_time: "Urgent (Within 2 Hours)",
          request_status: "open",
        });

        // Lead 2: Washing Machine
        if (wmCategory) {
          await supabase.from("service_requests").insert({
            customer_id: targetCustomerId,
            category_id: wmCategory.id,
            address_id: address.id,
            title: "Front Load Washing Machine Excessive Vibration & Noise",
            description: "Machine shakes vigorously during high-speed spin cycle. Suspecting drum bearing or shock absorber issue.",
            problem_details: {
              appliance: "Front Load Washing Machine",
              brand: "Bosch 7kg",
              symptom: "Drum vibrating loudly on spin",
              locality: "HSR Layout",
            },
            preferred_date: today,
            preferred_time: "Evening (4 PM - 8 PM)",
            request_status: "open",
          });
        }

        seededLeadsCount = 2;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bengaluru partner network & demo leads verified successfully!",
      stats: {
        primaryTechId,
        seededLeadsCount,
        activeTechCount: existingTechs?.length || 0,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to seed demo data" },
      { status: 500 }
    );
  }
}
