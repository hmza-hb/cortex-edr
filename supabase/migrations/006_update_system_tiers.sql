-- Phase 6: Syncing Database Tiers with SYSTEM_CONFIG

-- Add the new tier column that maps to SYSTEM_CONFIG.tiers keys
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tier text DEFAULT 'VIBE_CODER';

-- Migrate existing users based on their old plan_tier
UPDATE profiles SET tier = 'VIBE_CODER' WHERE plan_tier = 'free' OR tier IS NULL;
UPDATE profiles SET tier = 'DEVELOPER' WHERE plan_tier = 'starter';
UPDATE profiles SET tier = 'TEAMS' WHERE plan_tier = 'professional';
UPDATE profiles SET tier = 'ENTERPRISE' WHERE plan_tier = 'enterprise';

-- We do not add a strict CHECK constraint here so that future tiers can be added 
-- simply by updating the Codebase's SYSTEM_CONFIG without needing DB migrations.
