-- Create a view for easy user tier management with dropdown options
CREATE OR REPLACE VIEW user_tier_management AS
SELECT
    p.id,
    p.email,
    p.plan_tier as current_tier,
    p.scans_remaining,
    p.created_at,
    p.updated_at,
    CASE
        WHEN p.plan_tier = 'VIBE_CODER' THEN 'Vibe Coder (Free)'
        WHEN p.plan_tier = 'DEVELOPER' THEN 'Developer ($9/mo)'
        WHEN p.plan_tier = 'TEAMS' THEN 'Teams ($29/mo)'
        WHEN p.plan_tier = 'ENTERPRISE' THEN 'Enterprise (Custom)'
        ELSE 'Unknown Tier'
    END as tier_display_name
FROM profiles p
ORDER BY p.updated_at DESC;

-- Grant access to authenticated users
GRANT SELECT ON user_tier_management TO authenticated;

-- Create a function to update user tier with validation
CREATE OR REPLACE FUNCTION update_user_tier_admin(
    p_user_email TEXT,
    p_new_tier TEXT
) RETURNS JSON AS $$
DECLARE
    v_old_tier TEXT;
    v_valid_tiers TEXT[] := ARRAY['VIBE_CODER', 'DEVELOPER', 'TEAMS', 'ENTERPRISE'];
BEGIN
    -- Validate tier
    IF p_new_tier NOT IN (SELECT unnest(v_valid_tiers)) THEN
        RETURN json_build_object('success', false, 'error', 'Invalid tier. Must be one of: ' || array_to_string(v_valid_tiers, ', '));
    END IF;

    -- Get current tier
    SELECT plan_tier INTO v_old_tier
    FROM profiles
    WHERE email = lower(p_user_email);

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;

    -- Update tier
    UPDATE profiles
    SET
        plan_tier = p_new_tier,
        updated_at = NOW()
    WHERE email = lower(p_user_email);

    -- Log the change
    PERFORM log_payment_change(
        lower(p_user_email),
        'tier_updated',
        0,
        '',
        v_old_tier,
        p_new_tier,
        'admin@cortexedr.com',
        'Tier manually updated by admin'
    );

    RETURN json_build_object('success', true, 'message', 'Tier updated from ' || v_old_tier || ' to ' || p_new_tier);

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_user_tier_admin(TEXT, TEXT) TO authenticated;

-- Create enum type for tier selection (helps with dropdown in database tools)
DO $$ BEGIN
    CREATE TYPE tier_enum AS ENUM ('VIBE_CODER', 'DEVELOPER', 'TEAMS', 'ENTERPRISE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

COMMENT ON VIEW user_tier_management IS 'View for easy user tier management with dropdown options';
COMMENT ON FUNCTION update_user_tier_admin(TEXT, TEXT) IS 'Admin function to update user tiers with validation and logging';
