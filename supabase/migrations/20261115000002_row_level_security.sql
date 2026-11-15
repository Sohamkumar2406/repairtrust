-- ============================================================================
-- RepairTrust Database Schema - Migration 002 (Idempotent RLS)
-- Complete Row Level Security (RLS) & Access Control Enforcement
-- ============================================================================

-- Helper function: Check if authenticated caller is an Administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND account_status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if authenticated user is the assigned technician for a booking
CREATE OR REPLACE FUNCTION public.is_assigned_technician(booking_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.bookings b
        JOIN public.technician_profiles tp ON b.technician_id = tp.id
        WHERE b.id = booking_uuid AND tp.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security Trigger: Prevent regular users from promoting themselves to 'admin' or changing account_status
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

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_role_and_status_escalation();

-- Security Trigger: Prevent clients from directly setting payment status to captured
CREATE OR REPLACE FUNCTION public.prevent_client_payment_tampering()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.payment_status IS DISTINCT FROM OLD.payment_status OR NEW.paid_at IS DISTINCT FROM OLD.paid_at) THEN
        IF NOT (public.is_admin() OR current_user = 'service_role') THEN
            RAISE EXCEPTION 'SECURITY VIOLATION: Payment status can only be modified via verified server-side gateway webhooks';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_payment_tampering ON public.payments;
CREATE TRIGGER trg_prevent_payment_tampering
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.prevent_client_payment_tampering();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL 26 TABLES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_public_technician_name" ON public.profiles;
CREATE POLICY "profiles_public_technician_name" ON public.profiles
    FOR SELECT USING (role = 'technician');

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. CUSTOMER ADDRESSES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "addresses_select_owner_or_admin" ON public.customer_addresses;
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

DROP POLICY IF EXISTS "addresses_insert_own" ON public.customer_addresses;
CREATE POLICY "addresses_insert_own" ON public.customer_addresses
    FOR INSERT WITH CHECK (customer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "addresses_update_own" ON public.customer_addresses;
CREATE POLICY "addresses_update_own" ON public.customer_addresses
    FOR UPDATE USING (customer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "addresses_delete_own" ON public.customer_addresses;
CREATE POLICY "addresses_delete_own" ON public.customer_addresses
    FOR DELETE USING (customer_id = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. TECHNICIAN PROFILES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "technician_profiles_select" ON public.technician_profiles;
CREATE POLICY "technician_profiles_select" ON public.technician_profiles
    FOR SELECT USING (verification_status = 'verified' OR user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "technician_profiles_insert" ON public.technician_profiles;
CREATE POLICY "technician_profiles_insert" ON public.technician_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "technician_profiles_update" ON public.technician_profiles;
CREATE POLICY "technician_profiles_update" ON public.technician_profiles
    FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. TECHNICIAN DOCUMENTS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "technician_docs_select_own" ON public.technician_documents;
CREATE POLICY "technician_docs_select_own" ON public.technician_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.technician_profiles tp
            WHERE tp.id = public.technician_documents.technician_id AND tp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "technician_docs_insert_own" ON public.technician_documents;
CREATE POLICY "technician_docs_insert_own" ON public.technician_documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.technician_profiles tp
            WHERE tp.id = public.technician_documents.technician_id AND tp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- ----------------------------------------------------------------------------
-- 5. SERVICE CATEGORIES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "categories_select_public" ON public.service_categories;
CREATE POLICY "categories_select_public" ON public.service_categories
    FOR SELECT USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "categories_admin_all" ON public.service_categories;
CREATE POLICY "categories_admin_all" ON public.service_categories
    FOR ALL USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. TECHNICIAN SERVICES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "tech_services_select" ON public.technician_services;
CREATE POLICY "tech_services_select" ON public.technician_services
    FOR SELECT USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "tech_services_manage_own" ON public.technician_services;
CREATE POLICY "tech_services_manage_own" ON public.technician_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.technician_profiles tp
            WHERE tp.id = public.technician_services.technician_id AND tp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- ----------------------------------------------------------------------------
-- 7. SERVICE REQUESTS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "requests_select" ON public.service_requests;
CREATE POLICY "requests_select" ON public.service_requests
    FOR SELECT USING (
        customer_id = auth.uid()
        OR public.is_admin()
        OR (
            request_status IN ('open', 'quoted')
            AND EXISTS (
                SELECT 1 FROM public.technician_profiles tp
                WHERE tp.user_id = auth.uid() AND tp.verification_status = 'verified'
            )
        )
    );

DROP POLICY IF EXISTS "requests_insert_own" ON public.service_requests;
CREATE POLICY "requests_insert_own" ON public.service_requests
    FOR INSERT WITH CHECK (customer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "requests_update_own" ON public.service_requests;
CREATE POLICY "requests_update_own" ON public.service_requests
    FOR UPDATE USING (customer_id = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 8. REQUEST MEDIA POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "request_media_select" ON public.request_media;
CREATE POLICY "request_media_select" ON public.request_media
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.service_requests sr
            WHERE sr.id = public.request_media.request_id
              AND (
                  sr.customer_id = auth.uid()
                  OR public.is_admin()
                  OR EXISTS (
                      SELECT 1 FROM public.technician_profiles tp
                      WHERE tp.user_id = auth.uid() AND tp.verification_status = 'verified'
                  )
              )
        )
    );

DROP POLICY IF EXISTS "request_media_insert" ON public.request_media;
CREATE POLICY "request_media_insert" ON public.request_media
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.service_requests sr
            WHERE sr.id = public.request_media.request_id AND sr.customer_id = auth.uid()
        )
        OR public.is_admin()
    );

-- ----------------------------------------------------------------------------
-- 9. QUOTES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "quotes_select" ON public.quotes;
CREATE POLICY "quotes_select" ON public.quotes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.service_requests sr
            WHERE sr.id = public.quotes.request_id AND sr.customer_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.technician_profiles tp
            WHERE tp.id = public.quotes.technician_id AND tp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "quotes_insert_verified_tech" ON public.quotes;
CREATE POLICY "quotes_insert_verified_tech" ON public.quotes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.technician_profiles tp
            WHERE tp.id = public.quotes.technician_id 
              AND tp.user_id = auth.uid() 
              AND tp.verification_status = 'verified'
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "quotes_update" ON public.quotes;
CREATE POLICY "quotes_update" ON public.quotes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.technician_profiles tp
            WHERE tp.id = public.quotes.technician_id AND tp.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.service_requests sr
            WHERE sr.id = public.quotes.request_id AND sr.customer_id = auth.uid()
        )
        OR public.is_admin()
    );

-- ----------------------------------------------------------------------------
-- 10. QUOTE ITEMS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "quote_items_select" ON public.quote_items;
CREATE POLICY "quote_items_select" ON public.quote_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quotes q
            JOIN public.service_requests sr ON q.request_id = sr.id
            LEFT JOIN public.technician_profiles tp ON q.technician_id = tp.id
            WHERE q.id = public.quote_items.quote_id
              AND (sr.customer_id = auth.uid() OR tp.user_id = auth.uid() OR public.is_admin())
        )
    );

DROP POLICY IF EXISTS "quote_items_insert" ON public.quote_items;
CREATE POLICY "quote_items_insert" ON public.quote_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.quotes q
            JOIN public.technician_profiles tp ON q.technician_id = tp.id
            WHERE q.id = public.quote_items.quote_id AND tp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- ----------------------------------------------------------------------------
-- 11. BOOKINGS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "bookings_select" ON public.bookings;
CREATE POLICY "bookings_select" ON public.bookings
    FOR SELECT USING (
        customer_id = auth.uid()
        OR public.is_assigned_technician(id)
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "bookings_insert" ON public.bookings;
CREATE POLICY "bookings_insert" ON public.bookings
    FOR INSERT WITH CHECK (customer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "bookings_update" ON public.bookings;
CREATE POLICY "bookings_update" ON public.bookings
    FOR UPDATE USING (
        customer_id = auth.uid()
        OR public.is_assigned_technician(id)
        OR public.is_admin()
    );

-- ----------------------------------------------------------------------------
-- 12. BOOKING STATUS HISTORY POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "history_select" ON public.booking_status_history;
CREATE POLICY "history_select" ON public.booking_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = public.booking_status_history.booking_id
              AND (b.customer_id = auth.uid() OR public.is_assigned_technician(b.id) OR public.is_admin())
        )
    );

DROP POLICY IF EXISTS "history_insert" ON public.booking_status_history;
CREATE POLICY "history_insert" ON public.booking_status_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = public.booking_status_history.booking_id
              AND (b.customer_id = auth.uid() OR public.is_assigned_technician(b.id) OR public.is_admin())
        )
    );

-- ----------------------------------------------------------------------------
-- 13. PAYMENTS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "payments_select" ON public.payments;
CREATE POLICY "payments_select" ON public.payments
    FOR SELECT USING (
        customer_id = auth.uid()
        OR public.is_assigned_technician(booking_id)
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "payments_admin_only" ON public.payments;
CREATE POLICY "payments_admin_only" ON public.payments
    FOR ALL USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 14. PLATFORM COMMISSIONS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "commissions_select" ON public.platform_commissions;
CREATE POLICY "commissions_select" ON public.platform_commissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.technician_profiles tp
            WHERE tp.id = public.platform_commissions.technician_id AND tp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "commissions_admin_manage" ON public.platform_commissions;
CREATE POLICY "commissions_admin_manage" ON public.platform_commissions
    FOR ALL USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 15. REFUNDS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "refunds_select" ON public.refunds;
CREATE POLICY "refunds_select" ON public.refunds
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.payments p
            WHERE p.id = public.refunds.payment_id AND p.customer_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "refunds_admin_manage" ON public.refunds;
CREATE POLICY "refunds_admin_manage" ON public.refunds
    FOR ALL USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 16. WARRANTIES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "warranties_select" ON public.warranties;
CREATE POLICY "warranties_select" ON public.warranties
    FOR SELECT USING (
        customer_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.technician_profiles tp
            WHERE tp.id = public.warranties.technician_id AND tp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "warranties_manage" ON public.warranties;
CREATE POLICY "warranties_manage" ON public.warranties
    FOR ALL USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 17. REVIEWS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "reviews_select_public" ON public.reviews;
CREATE POLICY "reviews_select_public" ON public.reviews
    FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "reviews_insert_verified_customer" ON public.reviews;
CREATE POLICY "reviews_insert_verified_customer" ON public.reviews
    FOR INSERT WITH CHECK (
        customer_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = public.reviews.booking_id
              AND b.customer_id = auth.uid()
              AND b.booking_status = 'completed'
        )
    );

-- ----------------------------------------------------------------------------
-- 18. CONVERSATIONS & PARTICIPANTS & MESSAGES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "conversations_select" ON public.conversations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants cp
            WHERE cp.conversation_id = public.conversations.id AND cp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "conversation_participants_select" ON public.conversation_participants;
CREATE POLICY "conversation_participants_select" ON public.conversation_participants
    FOR SELECT USING (
        conversation_id IN (
            SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "messages_select" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversation_participants cp
            WHERE cp.conversation_id = public.messages.conversation_id AND cp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_insert" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.conversation_participants cp
            WHERE cp.conversation_id = public.messages.conversation_id AND cp.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- 21. NOTIFICATIONS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 22. DISPUTES & MESSAGES POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "disputes_select" ON public.disputes;
CREATE POLICY "disputes_select" ON public.disputes
    FOR SELECT USING (
        customer_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.technician_profiles tp
            WHERE tp.id = public.disputes.technician_id AND tp.user_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "disputes_insert" ON public.disputes;
CREATE POLICY "disputes_insert" ON public.disputes
    FOR INSERT WITH CHECK (customer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "dispute_messages_select" ON public.dispute_messages;
CREATE POLICY "dispute_messages_select" ON public.dispute_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.disputes d
            WHERE d.id = public.dispute_messages.dispute_id
              AND (d.customer_id = auth.uid() OR public.is_admin() OR EXISTS (
                  SELECT 1 FROM public.technician_profiles tp WHERE tp.id = d.technician_id AND tp.user_id = auth.uid()
              ))
        )
    );

DROP POLICY IF EXISTS "dispute_messages_insert" ON public.dispute_messages;
CREATE POLICY "dispute_messages_insert" ON public.dispute_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM public.disputes d
            WHERE d.id = public.dispute_messages.dispute_id
              AND (d.customer_id = auth.uid() OR public.is_admin() OR EXISTS (
                  SELECT 1 FROM public.technician_profiles tp WHERE tp.id = d.technician_id AND tp.user_id = auth.uid()
              ))
        )
    );

-- ----------------------------------------------------------------------------
-- 24. COUPONS & REDEMPTIONS POLICIES
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "coupons_select_active" ON public.coupons;
CREATE POLICY "coupons_select_active" ON public.coupons
    FOR SELECT USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "coupons_admin_manage" ON public.coupons;
CREATE POLICY "coupons_admin_manage" ON public.coupons
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "coupon_redemptions_select" ON public.coupon_redemptions;
CREATE POLICY "coupon_redemptions_select" ON public.coupon_redemptions
    FOR SELECT USING (customer_id = auth.uid() OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 26. AUDIT LOGS POLICIES (Immutable Audit Trail)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "audit_logs_insert_all" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_all" ON public.audit_logs
    FOR INSERT WITH CHECK (TRUE);
