import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: technicians, error } = await supabase
      .from("technician_profiles")
      .select(`
        id,
        user_id,
        business_name,
        experience_years,
        bio,
        verification_status,
        service_radius_km,
        average_rating,
        total_jobs,
        availability_status,
        created_at,
        user:profiles(full_name, phone, email, avatar_url, account_status),
        documents:technician_documents(id, document_type, storage_path, verification_status)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: technicians || [] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch technicians" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await req.json();
    const { technicianId, verificationStatus, rejectionReason } = body;

    if (!technicianId || !verificationStatus) {
      return NextResponse.json(
        { success: false, error: "technicianId and verificationStatus are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("technician_profiles")
      .update({
        verification_status: verificationStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", technicianId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Log admin audit action
    if (user) {
      await supabase.from("audit_logs").insert({
        actor_id: user.id,
        action: `technician_kyc_${verificationStatus}`,
        entity_type: "technician_profile",
        entity_id: technicianId,
        metadata: { verificationStatus, rejectionReason: rejectionReason || null },
      });
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Technician verification status updated to ${verificationStatus}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update technician" },
      { status: 500 }
    );
  }
}
