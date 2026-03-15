-- ============================================================
-- MODULE 9: TIER SYNCHRONIZATION
-- Syncing database constraints with new tier naming convention
-- ============================================================

-- 1. Update existing data to new naming convention
UPDATE profiles SET plan_tier = 'SCOUT' WHERE plan_tier = 'VIBE_CODER';
UPDATE profiles SET plan_tier = 'SENTINEL' WHERE plan_tier = 'DEVELOPER';
UPDATE profiles SET plan_tier = 'GUARDIAN' WHERE plan_tier = 'TEAMS';
UPDATE profiles SET plan_tier = 'FORTRESS' WHERE plan_tier = 'ENTERPRISE';

-- 2. Drop old constraints if they exist (searching by common names)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_tier_check;

-- 3. Add new strict constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_tier_check 
CHECK (plan_tier IN ('SCOUT', 'SENTINEL', 'GUARDIAN', 'FORTRESS'));

-- 4. Update the trigger function to use the new default tier
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan_tier, scans_remaining, referral_code)
  VALUES (
    new.id::text, 
    new.email, 
    'SCOUT', 
    3,
    UPPER(SUBSTRING(MD5(new.id::text || RANDOM()::TEXT) FROM 1 FOR 8))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update the tier management view to reflect new names
DROP VIEW IF EXISTS user_tier_management;
CREATE OR REPLACE VIEW user_tier_management AS
SELECT
    p.id,
    p.email,
    p.plan_tier as current_tier,
    p.scans_remaining,
    p.created_at,
    p.updated_at,
    CASE
        WHEN p.plan_tier = 'SCOUT' THEN 'Scout (Free)'
        WHEN p.plan_tier = 'SENTINEL' THEN 'Sentinel ($9/mo)'
        WHEN p.plan_tier = 'GUARDIAN' THEN 'Guardian ($49/mo)'
        WHEN p.plan_tier = 'FORTRESS' THEN 'Fortress ($299/mo)'
        ELSE 'Unknown Tier'
    END as tier_display_name
FROM profiles p;

-- 6. Update administrative tier management function
CREATE OR REPLACE FUNCTION update_user_tier_admin(
    p_user_email TEXT,
    p_new_tier TEXT,
    p_admin_notes TEXT DEFAULT 'Tier updated by administrator'
)
RETURNS JSON AS $$
DECLARE
    v_user_id TEXT;
    v_old_tier TEXT;
    v_scan_limit INTEGER;
    v_result JSON;
BEGIN
    -- 1. Validate the new tier
    IF p_new_tier NOT IN ('SCOUT', 'SENTINEL', 'GUARDIAN', 'FORTRESS') THEN
        RETURN json_build_object('success', false, 'error', 'Invalid tier name: ' || p_new_tier);
    END IF;

    -- 2. Find the user and current tier
    SELECT id::text, plan_tier INTO v_user_id, v_old_tier 
    FROM profiles 
    WHERE email = p_user_email;

    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;

    -- 3. Determine new scan limit
    v_scan_limit := CASE 
        WHEN p_new_tier = 'SCOUT' THEN 10
        WHEN p_new_tier = 'SENTINEL' THEN 15
        WHEN p_new_tier = 'GUARDIAN' THEN 50
        WHEN p_new_tier = 'FORTRESS' THEN 1000 -- Soft limit
        ELSE 10
    END;

    -- 4. Perform the update
    UPDATE profiles 
    SET 
        plan_tier = p_new_tier,
        scans_remaining = v_scan_limit,
        updated_at = NOW()
    WHERE id::text = v_user_id;

    -- 5. Log the change in payment history
    INSERT INTO payment_history (
        user_id,
        user_email,
        action,
        old_tier,
        new_tier,
        notes,
        created_at
    ) VALUES (
        v_user_id,
        p_user_email,
        'tier_updated',
        v_old_tier,
        p_new_tier,
        p_admin_notes,
        NOW()
    );

    RETURN json_build_object(
        'success', true, 
        'message', 'User ' || p_user_email || ' updated from ' || v_old_tier || ' to ' || p_new_tier,
        'new_scan_limit', v_scan_limit
    );
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant execution to service_role
GRANT EXECUTE ON FUNCTION update_user_tier_admin(TEXT, TEXT, TEXT) TO service_role;
