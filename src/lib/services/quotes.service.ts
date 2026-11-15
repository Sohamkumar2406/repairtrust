import { createClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/client";
import { Database } from "../supabase/types";
import { CreateQuoteInput } from "../validations/quotes";

export type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];

export async function createQuote(
  technicianId: string,
  input: CreateQuoteInput
): Promise<{
  data: QuoteRow | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();

    // 1. Insert Quote
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        request_id: input.requestId,
        technician_id: technicianId,
        labour_cost: input.labourCost,
        parts_cost: input.partsCost || 0,
        inspection_cost: input.inspectionCost || 0,
        tax_amount: input.taxAmount || 0,
        additional_charges: input.additionalCharges || 0,
        total_amount: input.totalAmount,
        estimated_completion_time: input.estimatedCompletionTime,
        validity_date: input.validityDate,
        terms: input.terms || null,
        quote_status: "pending",
      })
      .select()
      .single();

    if (quoteError || !quote) {
      return { data: null, error: quoteError?.message || "Failed to create quote" };
    }

    // 2. Insert line items if present
    if (input.items && input.items.length > 0) {
      const itemsToInsert = input.items.map((item) => ({
        quote_id: quote.id,
        item_name: item.itemName,
        description: item.description || null,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
      }));

      const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Failed to insert quote items:", itemsError);
      }
    }

    // 3. Mark request as quoted
    await supabase
      .from("service_requests")
      .update({ request_status: "quoted", updated_at: new Date().toISOString() })
      .eq("id", input.requestId);

    return { data: quote, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to submit quote" };
  }
}

export async function getQuotesForRequest(
  requestId: string,
  customerId: string
): Promise<{
  data: any[] | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        items:quote_items(*),
        technician:technician_profiles(
          id,
          business_name,
          experience_years,
          average_rating,
          total_jobs,
          profile:profiles(full_name, avatar_url, phone)
        )
      `)
      .eq("request_id", requestId)
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch quotes" };
  }
}

export async function getTechnicianQuotes(technicianId: string): Promise<{
  data: any[] | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        items:quote_items(*),
        request:service_requests(
          id,
          title,
          category:service_categories(name, slug),
          address:customer_addresses(area, pincode)
        )
      `)
      .eq("technician_id", technicianId)
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch technician quotes" };
  }
}
