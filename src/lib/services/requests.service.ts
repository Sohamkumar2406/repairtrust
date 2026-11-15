import { createClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/client";
import { Database } from "../supabase/types";
import { CreateServiceRequestInput } from "../validations/requests";

export type ServiceRequestRow = Database["public"]["Tables"]["service_requests"]["Row"];

export async function createServiceRequest(
  customerId: string,
  input: CreateServiceRequestInput
): Promise<{
  data: ServiceRequestRow | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_requests")
      .insert({
        customer_id: customerId,
        category_id: input.categoryId,
        address_id: input.addressId,
        title: input.title,
        description: input.description,
        problem_details: input.problemDetails || {},
        preferred_date: input.preferredDate,
        preferred_time: input.preferredTime,
        latitude: input.latitude || null,
        longitude: input.longitude || null,
        request_status: "open",
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to create service request" };
  }
}

export async function getCustomerRequests(customerId: string): Promise<{
  data: any[] | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_requests")
      .select(`
        *,
        category:service_categories(id, name, slug, icon),
        address:customer_addresses(id, address_line, area, pincode),
        quotes:quotes(
          id,
          labour_cost,
          parts_cost,
          inspection_cost,
          total_amount,
          estimated_completion_time,
          quote_status,
          terms,
          technician:technician_profiles(
            id,
            business_name,
            average_rating,
            total_jobs,
            user:profiles(full_name, avatar_url)
          )
        )
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch requests" };
  }
}

export async function getOpenRequestsForCategory(categoryId: string): Promise<{
  data: any[] | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_requests")
      .select(`
        id,
        category_id,
        title,
        description,
        problem_details,
        preferred_date,
        preferred_time,
        request_status,
        created_at,
        address:customer_addresses(area, pincode),
        category:service_categories(id, name, slug)
      `)
      .eq("category_id", categoryId)
      .in("request_status", ["open", "quoted"])
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch open requests" };
  }
}

export async function getRequestById(requestId: string): Promise<{
  data: any | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_requests")
      .select(`
        *,
        category:service_categories(*),
        address:customer_addresses(*),
        quotes:quotes(
          *,
          technician:technician_profiles(
            id,
            business_name,
            experience_years,
            average_rating,
            total_jobs,
            profile:profiles(full_name, avatar_url)
          ),
          items:quote_items(*)
        )
      `)
      .eq("id", requestId)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch request details" };
  }
}
