import { createClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/client";
import { Database } from "../supabase/types";

export type ServiceCategoryRow = Database["public"]["Tables"]["service_categories"]["Row"];

export async function getActiveCategories(): Promise<{
  data: ServiceCategoryRow[] | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error:
        "Supabase credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch categories" };
  }
}

export async function getCategoryBySlug(slug: string): Promise<{
  data: ServiceCategoryRow | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error:
        "Supabase credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch category" };
  }
}
