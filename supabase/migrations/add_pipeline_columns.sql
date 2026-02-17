-- Add missing columns to scans table for the new pipeline
ALTER TABLE scans ADD COLUMN IF NOT EXISTS repo_name TEXT;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS current_agent INTEGER DEFAULT 0;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS total_issues INTEGER DEFAULT 0;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS error TEXT;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Enable Supabase Realtime on both tables
ALTER PUBLICATION supabase_realtime ADD TABLE agent_events;
ALTER PUBLICATION supabase_realtime ADD TABLE scans;

-- Add index for fast event queries
CREATE INDEX IF NOT EXISTS idx_agent_events_scan_id 
ON agent_events(scan_id, created_at DESC);

-- Add index for scan queries
CREATE INDEX IF NOT EXISTS idx_scans_user_id 
ON scans(user_id, created_at DESC);
