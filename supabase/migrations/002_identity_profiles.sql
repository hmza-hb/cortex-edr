-- ============================================================
-- MODULE 2: IDENTITY & USER PROFILES
-- ============================================================

-- 1. Core Profile Infrastructure
CREATE TABLE IF NOT EXISTS profiles (
    id text primary key,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT,
    company TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    
    -- Development Context
    primary_stack JSONB DEFAULT '{"frameworks": [], "languages": [], "infrastructure": [], "databases": []}'::jsonb,
    team_size TEXT,
    security_level TEXT DEFAULT 'intermediate',
    building_for TEXT[] DEFAULT '{}',
    
    -- Settings & Preferences
    notification_settings JSONB DEFAULT '{"scanComplete": true, "criticalIssues": true, "weeklyDigest": false, "monthlyReport": true}'::jsonb,
    report_settings JSONB DEFAULT '{"includeAIPrompts": true, "preferredAI": "Cursor", "detailLevel": "Technical", "exportFormat": "PDF"}'::jsonb,
    analytics_consent BOOLEAN DEFAULT true,
    
    -- Internal Integrations
    integrations JSONB DEFAULT '{"slackWebhook": null, "discordWebhook": null, "githubToken": null}'::jsonb,
    
    -- Usage Stats
    total_scans INTEGER DEFAULT 0,
    scans_remaining INTEGER DEFAULT 3,
    first_scan_at TIMESTAMP WITH TIME ZONE,
    last_scan_at TIMESTAMP WITH TIME ZONE,
    avg_score DECIMAL(5,2) DEFAULT 0,
    most_common_issues TEXT[] DEFAULT '{}',
    
    -- Referral Data
    referral_code TEXT UNIQUE,
    referral_count INTEGER DEFAULT 0,
    referred_by TEXT,
    
    -- Tier Configuration
    tier TEXT DEFAULT 'VIBE_CODER',
    plan_tier TEXT DEFAULT 'VIBE_CODER',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Extended Settings & Referrals
CREATE TABLE IF NOT EXISTS user_settings (
    user_id TEXT PRIMARY KEY,
    theme TEXT DEFAULT 'dark',
    email_notifications BOOLEAN DEFAULT true,
    ai_preference TEXT DEFAULT 'gemini-2.0-flash',
    report_verbosity TEXT DEFAULT 'technical' CHECK (report_verbosity IN ('summary', 'technical', 'executive')),
    auto_fix_enabled BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id TEXT NOT NULL,
    referee_id TEXT,
    referee_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rewarded', 'expired')),
    reward_type TEXT DEFAULT 'free_scans',
    reward_amount INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Automatic Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan_tier, scans_remaining, referral_code)
  VALUES (
    new.id::text, 
    new.email, 
    'VIBE_CODER', 
    3,
    UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8))
  )
  ON CONFLICT (email) DO UPDATE 
  SET user_id = EXCLUDED.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Logic & Views
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
FROM profiles p;

-- 5. Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile." ON profiles FOR SELECT USING (id = auth.uid()::text);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (id = auth.uid()::text);
CREATE POLICY "Users can manage their own settings." ON user_settings FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view their own referrals." ON referrals FOR SELECT USING (auth.uid()::text = referrer_id);
