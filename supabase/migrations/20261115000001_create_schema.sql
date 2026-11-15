-- ============================================================================
-- RepairTrust Database Schema - Migration 001
-- Marketplace for Verified Doorstep Repairs in Bengaluru, India
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. PROFILES (Linked to Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'technician', 'admin')),
    account_status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'pending_verification', 'deactivated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- ----------------------------------------------------------------------------
-- 2. CUSTOMER ADDRESSES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    address_line TEXT NOT NULL,
    area VARCHAR(100) NOT NULL,
    city VARCHAR(60) NOT NULL DEFAULT 'Bengaluru',
    state VARCHAR(60) NOT NULL DEFAULT 'Karnataka',
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_customer_addresses_updated_at
    BEFORE UPDATE ON public.customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON public.customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_pincode ON public.customer_addresses(pincode);

-- ----------------------------------------------------------------------------
-- 3. TECHNICIAN PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.technician_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name VARCHAR(150),
    experience_years INT NOT NULL DEFAULT 1 CHECK (experience_years >= 0),
    bio TEXT,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'under_review')),
    service_radius_km DECIMAL(5, 2) NOT NULL DEFAULT 15.00 CHECK (service_radius_km > 0),
    average_rating DECIMAL(3, 2) NOT NULL DEFAULT 5.00 CHECK (average_rating >= 0 AND average_rating <= 5),
    total_jobs INT NOT NULL DEFAULT 0 CHECK (total_jobs >= 0),
    availability_status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_technician_profiles_updated_at
    BEFORE UPDATE ON public.technician_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_technician_profiles_user_id ON public.technician_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_technician_profiles_verification ON public.technician_profiles(verification_status);

-- ----------------------------------------------------------------------------
-- 4. TECHNICIAN DOCUMENTS (KYC, Certificates)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.technician_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(40) NOT NULL CHECK (document_type IN ('aadhaar', 'driving_license', 'pan_card', 'trade_certificate', 'police_clearance', 'workshop_license')),
    storage_path TEXT NOT NULL,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'under_review')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_technician_documents_updated_at
    BEFORE UPDATE ON public.technician_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_technician_documents_tech_id ON public.technician_documents(technician_id);

-- ----------------------------------------------------------------------------
-- 5. SERVICE CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(60) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_service_categories_updated_at
    BEFORE UPDATE ON public.service_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON public.service_categories(slug);

-- ----------------------------------------------------------------------------
-- 6. TECHNICIAN SERVICES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.technician_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
    starting_price DECIMAL(10, 2) NOT NULL CHECK (starting_price >= 0),
    experience_years INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(technician_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_technician_services_tech_id ON public.technician_services(technician_id);
CREATE INDEX IF NOT EXISTS idx_technician_services_cat_id ON public.technician_services(category_id);

-- ----------------------------------------------------------------------------
-- 7. SERVICE REQUESTS (Doorstep fault requests by customers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
    address_id UUID NOT NULL REFERENCES public.customer_addresses(id) ON DELETE RESTRICT,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    problem_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    request_status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (request_status IN ('draft', 'open', 'quoted', 'booked', 'in_progress', 'completed', 'cancelled', 'expired')),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_service_requests_updated_at
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_service_requests_customer_id ON public.service_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_category_id ON public.service_requests(category_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(request_status);

-- ----------------------------------------------------------------------------
-- 8. REQUEST MEDIA (Photos, videos of fault)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.request_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'audio', 'document')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_request_media_request_id ON public.request_media(request_id);

-- ----------------------------------------------------------------------------
-- 9. QUOTES (Submitted by technicians)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE CASCADE,
    labour_cost DECIMAL(10, 2) NOT NULL CHECK (labour_cost >= 0),
    parts_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (parts_cost >= 0),
    inspection_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (inspection_cost >= 0),
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    additional_charges DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (additional_charges >= 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    estimated_completion_time VARCHAR(80) NOT NULL,
    quote_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (quote_status IN ('pending', 'accepted', 'rejected', 'expired', 'withdrawn')),
    validity_date DATE NOT NULL,
    terms TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON public.quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_technician_id ON public.quotes(technician_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(quote_status);

-- ----------------------------------------------------------------------------
-- 10. QUOTE ITEMS (Line-item breakdown of labor and spare parts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items(quote_id);

-- ----------------------------------------------------------------------------
-- 11. BOOKINGS (Confirmed repair orders)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE RESTRICT,
    quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    booking_status VARCHAR(30) NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'technician_en_route', 'arrived', 'in_progress', 'completed', 'cancelled', 'disputed')),
    final_amount DECIMAL(10, 2) NOT NULL CHECK (final_amount >= 0),
    completion_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_technician_id ON public.bookings(technician_id);
CREATE INDEX IF NOT EXISTS idx_bookings_request_id ON public.bookings(request_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);

-- ----------------------------------------------------------------------------
-- 12. BOOKING STATUS HISTORY (Tamper-proof audit of booking timeline)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by UUID NOT NULL REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_booking_status_history_booking ON public.booking_status_history(booking_id);

-- ----------------------------------------------------------------------------
-- 13. PAYMENTS (Doorstep digital UPI/Card/Cash settlements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
    payment_method VARCHAR(50) NOT NULL,
    payment_gateway VARCHAR(50) NOT NULL,
    gateway_order_id VARCHAR(150),
    gateway_payment_id VARCHAR(150),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON public.payments(customer_id);

-- ----------------------------------------------------------------------------
-- 14. PLATFORM COMMISSIONS (Transparent technician payout tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE RESTRICT,
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE RESTRICT,
    commission_percentage DECIMAL(5, 2) NOT NULL CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    commission_amount DECIMAL(10, 2) NOT NULL CHECK (commission_amount >= 0),
    technician_payout DECIMAL(10, 2) NOT NULL CHECK (technician_payout >= 0),
    payout_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'settled', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_platform_commissions_updated_at
    BEFORE UPDATE ON public.platform_commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_platform_commissions_tech_id ON public.platform_commissions(technician_id);

-- ----------------------------------------------------------------------------
-- 15. REFUNDS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    reason TEXT NOT NULL,
    refund_status VARCHAR(30) NOT NULL DEFAULT 'initiated' CHECK (refund_status IN ('initiated', 'processed', 'failed')),
    gateway_refund_id VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_refunds_updated_at
    BEFORE UPDATE ON public.refunds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON public.refunds(payment_id);

-- ----------------------------------------------------------------------------
-- 16. WARRANTIES (Guaranteed 30 to 90 days protection)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE RESTRICT,
    warranty_period_days INT NOT NULL CHECK (warranty_period_days > 0),
    warranty_start_date DATE NOT NULL,
    warranty_end_date DATE NOT NULL,
    warranty_terms TEXT NOT NULL,
    warranty_status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (warranty_status IN ('active', 'claimed', 'expired', 'void')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_warranties_updated_at
    BEFORE UPDATE ON public.warranties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_warranties_customer_id ON public.warranties(customer_id);
CREATE INDEX IF NOT EXISTS idx_warranties_booking_id ON public.warranties(booking_id);

-- ----------------------------------------------------------------------------
-- 17. REVIEWS (Authentic, strictly 1 review per completed booking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE RESTRICT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified_booking BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_reviews_technician_id ON public.reviews(technician_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);

-- ----------------------------------------------------------------------------
-- 18. CONVERSATIONS (Linked to bookings)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_conversations_booking_id ON public.conversations(booking_id);

-- ----------------------------------------------------------------------------
-- 19. CONVERSATION PARTICIPANTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON public.conversation_participants(user_id);

-- ----------------------------------------------------------------------------
-- 20. MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    attachment_path TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- ----------------------------------------------------------------------------
-- 21. NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);

-- ----------------------------------------------------------------------------
-- 22. DISPUTES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    technician_id UUID NOT NULL REFERENCES public.technician_profiles(id) ON DELETE RESTRICT,
    issue_type VARCHAR(60) NOT NULL,
    description TEXT NOT NULL,
    dispute_status VARCHAR(30) NOT NULL DEFAULT 'opened' CHECK (dispute_status IN ('opened', 'investigating', 'resolved', 'dismissed')),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_disputes_updated_at
    BEFORE UPDATE ON public.disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_disputes_booking_id ON public.disputes(booking_id);
CREATE INDEX IF NOT EXISTS idx_disputes_customer_id ON public.disputes(customer_id);

-- ----------------------------------------------------------------------------
-- 23. DISPUTE MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dispute_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_id ON public.dispute_messages(dispute_id);

-- ----------------------------------------------------------------------------
-- 24. COUPONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    minimum_order_value DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (minimum_order_value >= 0),
    maximum_discount DECIMAL(10, 2) CHECK (maximum_discount IS NULL OR maximum_discount > 0),
    usage_limit INT CHECK (usage_limit IS NULL OR usage_limit > 0),
    used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    expiry_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- ----------------------------------------------------------------------------
-- 25. COUPON REDEMPTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
    discount_applied DECIMAL(10, 2) NOT NULL CHECK (discount_applied >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(coupon_id, customer_id, booking_id)
);

CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_customer ON public.coupon_redemptions(customer_id);

-- ----------------------------------------------------------------------------
-- 26. AUDIT LOGS (Immutable security and administrative audit trail)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(60) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
