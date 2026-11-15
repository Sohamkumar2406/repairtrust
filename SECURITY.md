# RepairTrust Security & Data Protection Architecture

This document outlines the security controls, Row Level Security (RLS) policies, and server-side authorization patterns protecting RepairTrust customers and technicians.

---

## 1. Core Security Tenets

1. **Defense-in-Depth**: Security is enforced at both the PostgreSQL database layer (via Row Level Security and stored triggers) and the application layer (via server-only SDK calls and Zod validation).
2. **Zero Trust for Client Claims**: Roles or permissions sent from frontend clients are never trusted. All privileged operations verify identity using Supabase JWT tokens via `auth.uid()`.
3. **No Direct Secret Exposure**: The `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to [`src/lib/supabase/admin.ts`](file:///Users/sohamkumar/Desktop/reapairtrust/src/lib/supabase/admin.ts), guarded by runtime assertions that throw an exception if ever executed on the client-side.

---

## 2. Row Level Security (RLS) Policies Overview

Row Level Security is enabled on **all 26 tables**. By default, all operations are denied unless an explicit policy permits them.

### A. Customer Data Isolation
- Customers can SELECT, INSERT, and UPDATE only rows where `customer_id = auth.uid()` or `id = auth.uid()`.
- Customer billing details and private home addresses are completely inaccessible to other customers.

### B. Address Masking & Authorized Disclosure Workflow
In home service marketplaces, unassigned technicians must not browse private home addresses.
- **Before Booking**: When a customer submits a repair request, technicians see only the coarse locality (e.g. *"Koramangala, 560034"*), never the door/apartment number.
- **After Booking**: The RLS policy on `public.customer_addresses` dynamically allows the technician to view the complete address **only after** the customer accepts their quotation and a booking enters `confirmed`, `technician_en_route`, `arrived`, or `in_progress` status:
  ```sql
  CREATE POLICY "addresses_select_owner_or_admin" ON public.customer_addresses
  FOR SELECT USING (
      customer_id = auth.uid() 
      OR public.is_admin()
      OR EXISTS (
          SELECT 1 FROM public.bookings b
          JOIN public.technician_profiles tp ON b.technician_id = tp.id
          JOIN public.service_requests sr ON b.request_id = sr.id
          WHERE sr.address_id = public.customer_addresses.id
            AND tp.user_id = auth.uid()
            AND b.booking_status IN ('confirmed', 'technician_en_route', 'arrived', 'in_progress')
      )
  );
  ```

### C. Prevention of Self-Role Escalation
A common vulnerability in web applications is users modifying their user profile JSON to set `"role": "admin"`.
RepairTrust prevents this via a database-level trigger on `public.profiles`:
```sql
CREATE OR REPLACE FUNCTION public.prevent_role_and_status_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.account_status IS DISTINCT FROM OLD.account_status) THEN
        IF NOT (public.is_admin() OR current_user = 'service_role') THEN
            RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized attempt to modify user role or account status';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### D. Prevention of Payment Status Tampering
Clients can never update `payments.payment_status` to `"captured"` or inject fraudulent confirmation IDs. Payment statuses are protected by the `prevent_client_payment_tampering` trigger, allowing transitions only via verified server-side webhook endpoints signed by the payment gateway.

### E. Private Technician KYC Vault
Technician documents (`aadhaar`, `driving_license`, `police_clearance`, `trade_certificate`) are stored in the private `technician-documents` bucket:
- Public download is disabled (`public = FALSE`).
- Direct URL access returns HTTP 403 Forbidden.
- Access requires a short-lived, time-limited **Signed URL** generated strictly on the server by authorized administrators reviewing KYC submissions.

### F. Immutable Audit Trail
The `public.audit_logs` table has policies allowing `INSERT` by authenticated actors and `SELECT` by administrators. Crucially, **no `UPDATE` or `DELETE` policies exist**, making the audit log permanently immutable even if an individual account is compromised.

---

## 3. Server-Side Security Verification Checklist

- [x] All 26 tables have Row Level Security explicitly enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
- [x] Sensitive service role keys are excluded from browser bundles.
- [x] Input payloads validated with strict Zod schemas before reaching the database.
- [x] Unique constraint on `reviews.booking_id` prevents duplicate review injections.
- [x] Foreign keys use `ON DELETE RESTRICT` on completed financial/booking records to prevent accidental cascade deletion.
- [x] Sensitive KYC storage buckets configured with private access controls.
