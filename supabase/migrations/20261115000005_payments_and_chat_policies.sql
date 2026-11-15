-- ============================================================================
-- REPAIRTRUST — MIGRATION 005: Payments, Platform Commissions, Chat & Notification Policies
-- ============================================================================

-- 1. Payments INSERT policy for authenticated customers, assigned technicians, or admins
DROP POLICY IF EXISTS "payments_insert_customer" ON public.payments;
DROP POLICY IF EXISTS "payments_insert" ON public.payments;
CREATE POLICY "payments_insert" ON public.payments
    FOR INSERT WITH CHECK (
        customer_id = auth.uid()
        OR public.is_assigned_technician(booking_id)
        OR public.is_admin()
    );

-- 2. Platform Commissions INSERT policy
DROP POLICY IF EXISTS "commissions_insert" ON public.platform_commissions;
CREATE POLICY "commissions_insert" ON public.platform_commissions
    FOR INSERT WITH CHECK (true);

-- 3. Conversations INSERT policy
DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;
CREATE POLICY "conversations_insert" ON public.conversations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = public.conversations.booking_id
            AND (
                b.customer_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.technician_profiles tp
                    WHERE tp.id = b.technician_id AND tp.user_id = auth.uid()
                )
            )
        )
        OR public.is_admin()
    );

-- 4. Conversation Participants INSERT policy
DROP POLICY IF EXISTS "conversation_participants_insert" ON public.conversation_participants;
CREATE POLICY "conversation_participants_insert" ON public.conversation_participants
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.conversations c
            JOIN public.bookings b ON c.booking_id = b.id
            WHERE c.id = public.conversation_participants.conversation_id
            AND (
                b.customer_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.technician_profiles tp
                    WHERE tp.id = b.technician_id AND tp.user_id = auth.uid()
                )
            )
        )
        OR public.is_admin()
    );

-- 5. Notifications INSERT policy
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
CREATE POLICY "notifications_insert" ON public.notifications
    FOR INSERT WITH CHECK (true);
