-- ============================================================================
-- RepairTrust Database Schema - Migration 004
-- Automatic Profile Creation on Supabase Auth Sign Up
-- ============================================================================

-- Function executed when a new user is created in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_full_name TEXT;
    user_phone TEXT;
    user_role TEXT;
    business_title TEXT;
BEGIN
    user_full_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1),
        'RepairTrust User'
    );
    
    user_phone := COALESCE(
        new.raw_user_meta_data->>'phone',
        new.phone,
        '0000000000'
    );

    user_role := COALESCE(
        new.raw_user_meta_data->>'role',
        'customer'
    );

    -- Ensure valid role constraint ('customer', 'technician', 'admin')
    IF user_role NOT IN ('customer', 'technician', 'admin') THEN
        user_role := 'customer';
    END IF;

    -- 1. Insert or update the public.profiles record
    INSERT INTO public.profiles (
        id,
        full_name,
        phone,
        email,
        role,
        account_status
    )
    VALUES (
        new.id,
        user_full_name,
        user_phone,
        new.email,
        user_role,
        'active'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        phone = CASE 
            WHEN public.profiles.phone = '0000000000' AND EXCLUDED.phone <> '0000000000' 
            THEN EXCLUDED.phone 
            ELSE public.profiles.phone 
        END;

    -- 2. If user registered as a technician, create technician_profiles row
    IF user_role = 'technician' THEN
        business_title := COALESCE(
            new.raw_user_meta_data->>'business_name',
            user_full_name || ' Repair Services'
        );

        INSERT INTO public.technician_profiles (
            user_id,
            business_name,
            experience_years,
            verification_status,
            availability_status
        )
        VALUES (
            new.id,
            business_title,
            COALESCE((new.raw_user_meta_data->>'experience_years')::INT, 2),
            'pending',
            TRUE
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
