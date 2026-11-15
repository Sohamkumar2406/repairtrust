import { createClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/client";
import { Database } from "../supabase/types";
import { CustomerProfileInput, TechnicianProfileInput, CustomerAddressInput } from "../validations/profiles";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type AddressRow = Database["public"]["Tables"]["customer_addresses"]["Row"];
export type TechnicianProfileRow = Database["public"]["Tables"]["technician_profiles"]["Row"];

export async function getProfile(userId: string): Promise<{
  data: ProfileRow | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch profile" };
  }
}

export async function updateCustomerProfile(
  userId: string,
  input: CustomerProfileInput
): Promise<{
  data: ProfileRow | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: input.fullName,
        phone: input.phone,
        email: input.email || null,
        avatar_url: input.avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to update profile" };
  }
}

export async function addCustomerAddress(
  customerId: string,
  input: CustomerAddressInput
): Promise<{
  data: AddressRow | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();

    // If default is requested, clear previous default
    if (input.isDefault) {
      await supabase
        .from("customer_addresses")
        .update({ is_default: false })
        .eq("customer_id", customerId);
    }

    const { data, error } = await supabase
      .from("customer_addresses")
      .insert({
        customer_id: customerId,
        address_line: input.addressLine,
        area: input.area,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        latitude: input.latitude || null,
        longitude: input.longitude || null,
        is_default: input.isDefault,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to add address" };
  }
}

export async function getCustomerAddresses(customerId: string): Promise<{
  data: AddressRow[] | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("customer_addresses")
      .select("*")
      .eq("customer_id", customerId)
      .order("is_default", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch addresses" };
  }
}

export async function getTechnicianProfile(userId: string): Promise<{
  data: (TechnicianProfileRow & { profile: ProfileRow }) | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase credentials are not configured in .env.local" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("technician_profiles")
      .select("*, profile:profiles(*)")
      .eq("user_id", userId)
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as any, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch technician profile" };
  }
}
