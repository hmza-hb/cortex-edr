-- Phase 5: Enterprise Profile System Expansion

-- Identity & Professional Stats
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- Development Context (JSONB for flexibility)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS primary_stack JSONB DEFAULT '{
  "frameworks": [],
  "languages": [],
  "infrastructure": [],
  "databases": []
}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_size TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS security_level TEXT DEFAULT 'intermediate';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS building_for TEXT[] DEFAULT '{}';

-- Notification & Report Preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{
  "scanComplete": true,
  "criticalIssues": true,
  "weeklyDigest": false,
  "monthlyReport": true
}'::jsonb;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS report_settings JSONB DEFAULT '{
  "includeAIPrompts": true,
  "preferredAI": "Cursor",
  "detailLevel": "Technical",
  "exportFormat": "PDF"
}'::jsonb;

-- External Integrations
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS integrations JSONB DEFAULT '{
  "slackWebhook": null,
  "discordWebhook": null,
  "githubToken": null
}'::jsonb;

-- Usage Analytics (Auto-tracked fields)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_scans INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_scan_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_scan_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avg_score DECIMAL(5,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS most_common_issues TEXT[] DEFAULT '{}';

-- Referral System
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Generate referral codes for existing users who don't have one
-- This uses a simple random string generation
UPDATE profiles 
SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8))
WHERE referral_code IS NULL;
