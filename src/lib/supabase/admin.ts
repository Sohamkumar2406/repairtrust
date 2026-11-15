import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

// Security Assertion: Ensure this module is never bundled or executed on the client/browser
if (typeof window !== "undefined") {
  throw new Error(
    "SECURITY VIOLATION: lib/supabase/admin.ts must never be executed on the client-side!"
  );
}

export function hasAdminCredentials(): boolean {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return (
    !!serviceRoleKey &&
    serviceRoleKey !== "your-service-role-key-here" &&
    serviceRoleKey !== "placeholder-service-role-key" &&
    serviceRoleKey.length > 20
  );
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasAdminCredentials() || !supabaseUrl || supabaseUrl === "https://your-project-id.supabase.co") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing or invalid in .env.local. Admin client cannot be initialized."
    );
  }

  return createSupabaseClient<Database>(
    supabaseUrl,
    serviceRoleKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
