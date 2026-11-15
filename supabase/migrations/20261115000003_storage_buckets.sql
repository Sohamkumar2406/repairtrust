-- ============================================================================
-- RepairTrust Database Schema - Migration 003
-- Supabase Storage Buckets & Policies
-- ============================================================================

-- Create the 4 storage buckets if they do not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'profile-images', 
        'profile-images', 
        TRUE, 
        5242880, -- 5 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    ),
    (
        'repair-request-media', 
        'repair-request-media', 
        FALSE, 
        20971520, -- 20 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']
    ),
    (
        'technician-documents', 
        'technician-documents', 
        FALSE, -- STRICTLY PRIVATE KYC VAULT
        10485760, -- 10 MB
        ARRAY['image/jpeg', 'image/png', 'application/pdf']
    ),
    (
        'chat-attachments', 
        'chat-attachments', 
        FALSE, 
        10485760, -- 10 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    )
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ----------------------------------------------------------------------------
-- 1. Profile Images Policies (Public read, authenticated user upload)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "profile_images_public_read" ON storage.objects;
CREATE POLICY "profile_images_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "profile_images_user_upload" ON storage.objects;
CREATE POLICY "profile_images_user_upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile-images' 
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "profile_images_user_update" ON storage.objects;
CREATE POLICY "profile_images_user_update" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profile-images' 
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ----------------------------------------------------------------------------
-- 2. Repair Request Media Policies
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "request_media_read" ON storage.objects;
CREATE POLICY "request_media_read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'repair-request-media'
        AND auth.uid() IS NOT NULL
    );

DROP POLICY IF EXISTS "request_media_upload" ON storage.objects;
CREATE POLICY "request_media_upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'repair-request-media'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ----------------------------------------------------------------------------
-- 3. Technician KYC Documents (Strictly Private - Signed URLs only)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "tech_docs_read_restricted" ON storage.objects;
CREATE POLICY "tech_docs_read_restricted" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'technician-documents'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'admin'
            )
        )
    );

DROP POLICY IF EXISTS "tech_docs_upload_own" ON storage.objects;
CREATE POLICY "tech_docs_upload_own" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'technician-documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ----------------------------------------------------------------------------
-- 4. Chat Attachments
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "chat_attachments_read" ON storage.objects;
CREATE POLICY "chat_attachments_read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'chat-attachments'
        AND auth.uid() IS NOT NULL
    );

DROP POLICY IF EXISTS "chat_attachments_upload" ON storage.objects;
CREATE POLICY "chat_attachments_upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'chat-attachments'
        AND auth.uid() IS NOT NULL
    );
