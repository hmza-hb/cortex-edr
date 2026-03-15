-- ============================================================
-- MODULE 8: FIX - Add missing referral_code column and fix trigger
-- Run this in Supabase SQL editor
-- ============================================================

-- 1. Add missing columns to profiles table if they don't already exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'referral_code'
    ) THEN
        ALTER TABLE profiles ADD COLUMN referral_code TEXT UNIQUE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'referral_count'
    ) THEN
        ALTER TABLE profiles ADD COLUMN referral_count INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'referred_by'
    ) THEN
        ALTER TABLE profiles ADD COLUMN referred_by TEXT;
    END IF;
END $$;

-- 2. Backfill any existing profiles with a referral code if missing
UPDATE profiles 
SET referral_code = UPPER(SUBSTRING(MD5(id || RANDOM()::TEXT) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- 3. Recreate the trigger function using ON CONFLICT (id) — the primary key, always unique
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan_tier, scans_remaining, referral_code)
  VALUES (
    new.id::text, 
    new.email, 
    'VIBE_CODER', 
    3,
    UPPER(SUBSTRING(MD5(new.id::text || RANDOM()::TEXT) FROM 1 FOR 8))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
