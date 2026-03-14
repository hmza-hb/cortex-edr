-- ============================================================
-- MODULE 7: ADMINISTRATIVE SUDO & UTILITIES
-- ============================================================

-- A. Admin Tier Management Discovery View
DROP VIEW IF EXISTS user_tier_management;
CREATE OR REPLACE VIEW user_tier_management AS
SELECT 
    p.email,
    p.id as user_id,
    p.plan_tier,
    p.scans_remaining,
    p.payment_status,
    p.updated_at,
    (SELECT COUNT(*) FROM scans s WHERE s.user_id = p.id) as total_scans
FROM profiles p;

-- B. Sudo: Update User Tier & Allocation
CREATE OR REPLACE FUNCTION update_user_tier_admin(
    p_user_email TEXT,
    p_new_tier TEXT
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_old_tier TEXT;
    v_scan_limit INTEGER;
BEGIN
    -- 1. Find User & Current State
    SELECT id, plan_tier INTO v_user_id, v_old_tier 
    FROM profiles WHERE email = p_user_email;
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User profile not found');
    END IF;

    -- 2. Determine Scan Allocation (Refers to logic in system config)
    v_scan_limit := CASE 
        WHEN p_new_tier = 'VIBE_CODER' THEN 3
        WHEN p_new_tier = 'DEVELOPER' THEN 20
        WHEN p_new_tier = 'TEAMS' THEN 100
        WHEN p_new_tier = 'ENTERPRISE' THEN 1000
        ELSE 3
    END;

    -- 3. Execute Core Update
    UPDATE profiles SET 
        plan_tier = p_new_tier,
        scans_remaining = v_scan_limit,
        payment_status = 'paid',
        payment_date = NOW(),
        updated_at = NOW()
    WHERE id = v_user_id;

    -- 4. Audit Log
    PERFORM log_payment_change(
        p_user_email,
        'tier_updated',
        0,
        'administrative',
        v_old_tier,
        p_new_tier,
        'Administrative manual tier upgrade via sudo console',
        'SYSTEM_ADMIN'
    );

    RETURN json_build_object(
        'success', true, 
        'message', 'Protocol executed successfully. Tier set to ' || p_new_tier,
        'user_id', v_user_id,
        'new_limit', v_scan_limit
    );
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. Monitoring: Active System Pulse (Cross-User Scans)
CREATE OR REPLACE VIEW system_active_scans AS
SELECT 
    s.id,
    s.repo_url,
    s.status,
    p.email as user_email,
    s.created_at
FROM scans s
JOIN profiles p ON s.user_id = p.id
ORDER BY s.created_at DESC;

-- D. Grant Sudo Execution
GRANT EXECUTE ON FUNCTION update_user_tier_admin(TEXT, TEXT) TO service_role;
