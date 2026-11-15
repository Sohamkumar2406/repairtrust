import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const isConfigured = isSupabaseConfigured();
  const hasServiceKey =
    !!process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== "your-service-role-key-here";

  let connectionTest: {
    tested: boolean;
    connected: boolean;
    details: string;
    schemaStatus?: string;
  } = {
    tested: false,
    connected: false,
    details: "Credentials not provided. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
  };

  if (isConfigured) {
    try {
      const supabase = await createClient();
      // Attempt a lightweight probe against the service_categories table
      const { data, error, status } = await supabase
        .from("service_categories")
        .select("id", { count: "exact", head: true });

      if (error) {
        if (error.code === "42P01" || error.message.includes("does not exist")) {
          // Connected to database, but migration 001 not yet applied
          connectionTest = {
            tested: true,
            connected: true,
            details: "Connected to Supabase project successfully, but database tables are not yet created.",
            schemaStatus: "Pending migration: Run migrations in supabase/migrations/ via Supabase SQL Editor.",
          };
        } else {
          connectionTest = {
            tested: true,
            connected: false,
            details: `Supabase returned an error: ${error.message} (Code: ${error.code || status})`,
          };
        }
      } else {
        // Table exists and query succeeded
        connectionTest = {
          tested: true,
          connected: true,
          details: "Connected to Supabase database successfully. Tables are accessible.",
          schemaStatus: "Migrations applied and verified.",
        };
      }
    } catch (err: any) {
      connectionTest = {
        tested: true,
        connected: false,
        details: `Connection attempt failed: ${err.message || "Network error"}`,
      };
    }
  }

  console.log("[API Health Check Diagnostic]:", JSON.stringify(connectionTest));

  return NextResponse.json({
    status: "ok",
    service: "RepairTrust API",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    database: {
      provider: "Supabase PostgreSQL",
      configured: isConfigured,
      adminConfigured: hasServiceKey,
      connectionTest,
    },
  });
}
