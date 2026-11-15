import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Fetch open service requests in Bengaluru
    const { data: requests, error } = await supabase
      .from("service_requests")
      .select(`
        id,
        title,
        description,
        problem_details,
        preferred_date,
        preferred_time,
        request_status,
        created_at,
        category:service_categories(id, name, slug, icon),
        address:customer_addresses(id, address_line, area, pincode),
        quotes(id, total_amount, quote_status, technician_id)
      `)
      .in("request_status", ["open", "quoted"])
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Get current technician profile if user is logged in
    let currentTechId: string | null = null;
    if (user) {
      const { data: tech } = await supabase
        .from("technician_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (tech) currentTechId = tech.id;
    }

    return NextResponse.json({
      success: true,
      currentTechId,
      data: requests || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
