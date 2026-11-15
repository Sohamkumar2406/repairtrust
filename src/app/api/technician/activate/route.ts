import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to activate your technician profile." },
        { status: 401 }
      );
    }

    const { data: existingTech } = await supabase
      .from("technician_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingTech) {
      await supabase
        .from("technician_profiles")
        .update({
          verification_status: "verified",
          availability_status: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingTech.id);
    } else {
      await supabase
        .from("technician_profiles")
        .insert({
          user_id: user.id,
          business_name: "Verified Expert Repairs",
          experience_years: 4,
          verification_status: "verified",
          availability_status: true,
        });
    }

    return NextResponse.json({
      success: true,
      message: "Technician profile activated and verified! You can now receive leads and submit quotations.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to activate profile" },
      { status: 500 }
    );
  }
}
