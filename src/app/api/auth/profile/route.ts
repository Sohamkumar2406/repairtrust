import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try fetching with regular client
    let { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // If not found with user client, try admin client
    if (!profile) {
      try {
        const admin = createAdminClient();
        const { data: adminProfile } = await admin
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        profile = adminProfile;
      } catch {
        // Ignore admin client error if key is not set
      }
    }

    let technicianProfile = null;
    if (profile?.role === "technician") {
      const { data: techData } = await supabase
        .from("technician_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      technicianProfile = techData;
    }

    return NextResponse.json({
      success: true,
      user,
      profile,
      technicianProfile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, fullName, phone, email, role, businessName } = body;

    if (!userId || !fullName || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Try admin client first if available, else user client
    let admin = null;
    try {
      admin = createAdminClient();
    } catch {
      // Admin client not configured
    }

    const client = admin || (await createClient());

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: fullName,
          phone,
          email: email || null,
          role: role || "customer",
          account_status: "active",
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { success: false, error: profileError.message },
        { status: 400 }
      );
    }

    if (role === "technician") {
      await client
        .from("technician_profiles")
        .upsert(
          {
            user_id: userId,
            business_name: businessName || `${fullName} Repair Services`,
            experience_years: 2,
            verification_status: "pending",
            availability_status: true,
          },
          { onConflict: "user_id" }
        );
    }

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sync profile" },
      { status: 500 }
    );
  }
}
