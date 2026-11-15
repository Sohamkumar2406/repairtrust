import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCustomerRequests } from "@/lib/services/requests.service";
import { BENGALURU_LOCATIONS } from "@/data/bengaluruLocations";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { data, error } = await getCustomerRequests(user.id);
  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let client = null;
    try {
      client = createAdminClient();
    } catch {
      // Fallback
    }
    const supabase = await createClient();
    const effectiveClient = client || supabase;

    // 1. Determine customer identity
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let customerId = user?.id;

    const {
      serviceId,
      categoryId: explicitCategoryId,
      selectedIssue,
      customIssue,
      location = "Koramangala",
      addressDetails,
      preferredDate,
      preferredTime = "asap",
      customerName,
      customerPhone,
      customerEmail,
      mediaPaths = [],
    } = body;

    if (!customerPhone && !user) {
      return NextResponse.json(
        { success: false, error: "Mobile number is required to book a repair" },
        { status: 400 }
      );
    }

    if (!addressDetails) {
      return NextResponse.json(
        { success: false, error: "Address details are required" },
        { status: 400 }
      );
    }

    // 2. If unauthenticated, ensure a customer profile exists
    if (!customerId) {
      const cleanPhone = (customerPhone || "").replace(/\D/g, "");
      // Check if profile exists with this phone
      const { data: existingProfile } = await effectiveClient
        .from("profiles")
        .select("id")
        .eq("phone", cleanPhone)
        .maybeSingle();

      if (existingProfile) {
        customerId = existingProfile.id;
      } else {
        // Generate anonymous guest user ID
        const guestId = crypto.randomUUID();
        const { data: newProfile, error: profileErr } = await effectiveClient
          .from("profiles")
          .insert({
            id: guestId,
            full_name: customerName || "Guest Customer",
            phone: cleanPhone || "9876543210",
            email: customerEmail || null,
            role: "customer",
            account_status: "active",
          })
          .select("id")
          .single();

        if (profileErr) {
          // If insert failed due to FK constraint on auth.users when admin not used
          // Use authenticated user or report
          return NextResponse.json(
            { success: false, error: "Please sign in or create an account to book your repair." },
            { status: 401 }
          );
        }
        customerId = newProfile.id;
      }
    }

    // 3. Resolve category ID
    let finalCategoryId = explicitCategoryId;
    let categoryName = "Repair Service";

    if (!finalCategoryId) {
      const categorySlug = (serviceId || "ac-repair").toLowerCase().trim();
      const { data: categoryData } = await effectiveClient
        .from("service_categories")
        .select("id, name, slug")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (categoryData) {
        finalCategoryId = categoryData.id;
        categoryName = categoryData.name;
      } else {
        // Fallback: match by name
        const cleanKeyword = categorySlug.replace("-repair", "").replace(/-/g, " ");
        const { data: catByName } = await effectiveClient
          .from("service_categories")
          .select("id, name, slug")
          .ilike("name", `%${cleanKeyword}%`)
          .maybeSingle();

        if (catByName) {
          finalCategoryId = catByName.id;
          categoryName = catByName.name;
        } else {
          // Fallback to first available category
          const { data: firstCat } = await effectiveClient
            .from("service_categories")
            .select("id, name, slug")
            .limit(1)
            .maybeSingle();
          if (firstCat) {
            finalCategoryId = firstCat.id;
            categoryName = firstCat.name;
          }
        }
      }
    }

    if (!finalCategoryId) {
      return NextResponse.json(
        { success: false, error: "Service category not found" },
        { status: 400 }
      );
    }

    // 4. Resolve Pincode
    const matchedLoc = BENGALURU_LOCATIONS.find(
      (l) => l.name.toLowerCase() === location.toLowerCase()
    );
    const pincode = matchedLoc ? matchedLoc.pincode : "560034";

    // 5. Create or reuse Customer Address
    const { data: addressData, error: addressError } = await effectiveClient
      .from("customer_addresses")
      .insert({
        customer_id: customerId,
        address_line: addressDetails,
        area: location,
        city: "Bengaluru",
        state: "Karnataka",
        pincode,
        is_default: false,
      })
      .select("id")
      .single();

    if (addressError) {
      return NextResponse.json(
        { success: false, error: `Failed to save address: ${addressError.message}` },
        { status: 500 }
      );
    }

    // 6. Format Dates
    const today = new Date().toISOString().split("T")[0];
    const targetDate = preferredDate && /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ? preferredDate : today;

    const issueSummary = customIssue || selectedIssue || "General fault inspection";
    const requestTitle = `${categoryName}: ${issueSummary.slice(0, 100)}`;
    const fullDescription = `${issueSummary}. Location: ${location} (Pincode: ${pincode}). Address: ${addressDetails}. Preferred Time: ${preferredTime}. Contact: ${customerName || "Customer"} (+91 ${customerPhone || ""})`;

    // 7. Insert Service Request
    const { data: requestData, error: requestError } = await effectiveClient
      .from("service_requests")
      .insert({
        customer_id: customerId,
        category_id: finalCategoryId,
        address_id: addressData.id,
        title: requestTitle,
        description: fullDescription,
        problem_details: {
          issue: selectedIssue || null,
          customIssue: customIssue || null,
          locality: location,
          pincode,
          preferredTime,
          customerName,
          customerPhone,
        },
        preferred_date: targetDate,
        preferred_time: preferredTime,
        request_status: "open",
      })
      .select()
      .single();

    if (requestError) {
      return NextResponse.json(
        { success: false, error: `Failed to create repair request: ${requestError.message}` },
        { status: 500 }
      );
    }

    // 8. Insert Request Media (if uploaded)
    if (mediaPaths && Array.isArray(mediaPaths) && mediaPaths.length > 0) {
      const mediaRecords = mediaPaths.map((storagePath: string) => ({
        request_id: requestData.id,
        storage_path: storagePath,
        media_type: "image" as const,
      }));

      await effectiveClient.from("request_media").insert(mediaRecords);
    }

    // 9. Send in-app notification
    await effectiveClient.from("notifications").insert({
      user_id: customerId,
      title: "Repair Request Broadcasted",
      message: `Your request for ${categoryName} in ${location} has been broadcasted to verified technicians.`,
      notification_type: "request_created",
      is_read: false,
    });

    // 10. Automatically generate competitive quotation from verified partner network
    try {
      const { data: verifiedTechs } = await effectiveClient
        .from("technician_profiles")
        .select("id, business_name")
        .eq("verification_status", "verified")
        .limit(2);

      if (verifiedTechs && verifiedTechs.length > 0) {
        for (const tech of verifiedTechs) {
          const validityDate = new Date();
          validityDate.setDate(validityDate.getDate() + 3);

          await effectiveClient.from("quotes").insert({
            request_id: requestData.id,
            technician_id: tech.id,
            labour_cost: 349,
            parts_cost: 0,
            inspection_cost: 0,
            tax_amount: 0,
            total_amount: 349,
            estimated_completion_time: "45 - 60 mins",
            quote_status: "pending",
            validity_date: validityDate.toISOString().split("T")[0],
            terms: "Includes upfront diagnostic inspection, precision repair, and RepairTrust 60-Day Guarantee.",
          });
        }
      }
    } catch (e) {
      console.warn("Auto-quote notice:", e);
    }

    const bookingRef = `RT-BLR-${requestData.id.slice(0, 8).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      bookingRef,
      data: requestData,
      message: `Your request has been broadcasted to verified technicians in ${location}.`,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process repair request" },
      { status: 500 }
    );
  }
}
