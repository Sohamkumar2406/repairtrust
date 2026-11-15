# RepairTrust — Supabase Setup & Connection Guide

This guide walks you through setting up a production-ready Supabase PostgreSQL backend for **RepairTrust**, applying the 26 database tables, configuring Row Level Security (RLS), setting up storage buckets, and seeding initial core service categories.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New Project**.
3. Select your organization and enter:
   - **Name**: `repairtrust-prod` (or `repairtrust-dev`)
   - **Database Password**: Choose a strong, secure password (store it safely).
   - **Region**: Select **South Asia (Mumbai) - ap-south-1** for the lowest latency in Bengaluru, India.
   - **Pricing Plan**: Free tier (or Pro for production workloads).
4. Click **Create new project** and wait 1–2 minutes for the database cluster to initialize.

---

## 2. Obtain Your Supabase URL and API Keys

1. In the Supabase Dashboard, navigate to **Project Settings** (gear icon in sidebar).
2. Click on **API** in the left menu.
3. Locate the following three values:
   - **Project URL**: `https://<your-project-ref>.supabase.co`
   - **anon / public key**: The publishable JWT key (safe for browser and public queries governed by RLS).
   - **service_role key**: The privileged admin JWT key (**SECRET: Never expose to browser or client code!**).

---

## 3. Configure Local Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and paste your actual credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

---

## 4. Run SQL Migrations

You can run the migrations either using the **Supabase Dashboard SQL Editor** or via the **Supabase CLI**.

### Option A: Via Supabase Dashboard (Recommended for Fast Setup)

1. Open your project dashboard at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Click on the **SQL Editor** tab (left sidebar, terminal icon).
3. Click **New Query**.
4. Open and copy the contents of each migration file in numerical order:
   - **Step 1**: Open [`supabase/migrations/20261115000001_create_schema.sql`](file:///Users/sohamkumar/Desktop/reapairtrust/supabase/migrations/20261115000001_create_schema.sql), paste into SQL Editor, and click **Run**.
     *(Creates all 26 tables, foreign keys, constraints, and indexes).*
   - **Step 2**: Open [`supabase/migrations/20261115000002_row_level_security.sql`](file:///Users/sohamkumar/Desktop/reapairtrust/supabase/migrations/20261115000002_row_level_security.sql), paste into SQL Editor, and click **Run**.
     *(Enables Row Level Security on all 26 tables and installs access policies and anti-escalation triggers).*
   - **Step 3**: Open [`supabase/migrations/20261115000003_storage_buckets.sql`](file:///Users/sohamkumar/Desktop/reapairtrust/supabase/migrations/20261115000003_storage_buckets.sql), paste into SQL Editor, and click **Run**.
     *(Initializes the 4 storage buckets and private KYC vault policies).*

### Option B: Via Supabase CLI

```bash
# Login to Supabase CLI
npx supabase login

# Link your local repo to your remote project
npx supabase link --project-ref <your-project-ref>

# Push all migrations
npx supabase db push
```

---

## 5. Run Seed SQL

To populate the 8 initial service categories (AC, Washing Machine, Laptop, Refrigerator, Mobile, Electrical, Plumbing, TV Repair):

1. In the Supabase Dashboard, go to **SQL Editor**.
2. Click **New Query**.
3. Copy the contents of [`supabase/seed.sql`](file:///Users/sohamkumar/Desktop/reapairtrust/supabase/seed.sql), paste into the editor, and click **Run**.
4. You will see 8 rows inserted into `public.service_categories`.

---

## 6. Verify Database Tables

1. In the Supabase Dashboard, click on **Table Editor** (spreadsheet icon in sidebar).
2. Verify that all 26 tables exist under the `public` schema:
   - `profiles`
   - `customer_addresses`
   - `technician_profiles`
   - `technician_documents`
   - `service_categories` (should show 8 rows)
   - `technician_services`
   - `service_requests`
   - `request_media`
   - `quotes`
   - `quote_items`
   - `bookings`
   - `booking_status_history`
   - `payments`
   - `platform_commissions`
   - `refunds`
   - `warranties`
   - `reviews`
   - `conversations`
   - `conversation_participants`
   - `messages`
   - `notifications`
   - `disputes`
   - `dispute_messages`
   - `coupons`
   - `coupon_redemptions`
   - `audit_logs`

---

## 7. How to Test Row Level Security (RLS) Policies

You can test RLS policies directly in the Supabase SQL Editor by impersonating different roles:

```sql
-- Test 1: Impersonate a customer
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '<customer-user-uuid>';

-- Customer can read only their own addresses
SELECT * FROM public.customer_addresses;

-- Test 2: Unverified technician cannot see open customer requests
SET LOCAL "request.jwt.claim.sub" = '<unverified-technician-uuid>';
SELECT * FROM public.service_requests WHERE request_status = 'open';
-- Should return 0 rows if unverified

-- Test 3: Reset role back to postgres admin
RESET ROLE;
```

---

## 8. Verifying API Health Endpoint

Once `.env.local` is configured, start the Next.js server:
```bash
npm run dev
```

Visit the health diagnostic endpoint in your browser:
👉 **[http://localhost:3000/api/health](http://localhost:3000/api/health)**

It will return:
```json
{
  "status": "ok",
  "service": "RepairTrust API",
  "database": {
    "provider": "Supabase PostgreSQL",
    "configured": true,
    "adminConfigured": true,
    "connectionStatus": "Credentials present. Verify database connectivity by applying migrations."
  }
}
```
