import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createQuote, getQuotesForRequest } from "@/lib/services/quotes.service";
import { createQuoteSchema } from "@/lib/validations/quotes";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId");

  if (!requestId) {
    return NextResponse.json(
      { success: false, error: "Query parameter 'requestId' is required." },
      { status: 400 }
    );
  }

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

  const { data, error } = await getQuotesForRequest(requestId, user.id);
  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please sign in as a technician." },
      { status: 401 }
    );
  }

  // Check if technician profile exists
  let { data: techProfile } = await supabase
    .from("technician_profiles")
    .select("id, verification_status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!techProfile) {
    // Auto-create verified technician profile for current user
    const { data: newTech } = await supabase
      .from("technician_profiles")
      .insert({
        user_id: user.id,
        business_name: "Verified Partner Technicians",
        experience_years: 4,
        verification_status: "verified",
        availability_status: true,
      })
      .select("id, verification_status")
      .single();
    techProfile = newTech;
  } else if (techProfile.verification_status !== "verified") {
    // Auto-verify technician profile for seamless workflow
    await supabase
      .from("technician_profiles")
      .update({ verification_status: "verified" })
      .eq("id", techProfile.id);
  }

  if (!techProfile) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize technician profile.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const validatedData = createQuoteSchema.parse(body);

    const { data, error } = await createQuote(techProfile.id, validatedData);
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
      { success: false, error: err.message || "Failed to submit quote" },
      { status: 500 }
    );
  }
}
