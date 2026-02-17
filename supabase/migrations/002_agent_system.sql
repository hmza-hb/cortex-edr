-- Phase 1: Update Database Schema for Agent System

-- Create Repositories table
CREATE TABLE IF NOT EXISTS repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT,
  last_scan_id UUID,
  last_scanned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update Scans table with missing columns
ALTER TABLE scans 
ADD COLUMN IF NOT EXISTS repo_name TEXT,
ADD COLUMN IF NOT EXISTS current_agent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Create Agent Events table (for real-time visualization)
CREATE TABLE IF NOT EXISTS agent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  agent_id INTEGER, -- 1-7
  agent_name TEXT,
  event_type TEXT, -- started, processing, found_issue, completed, error
  message TEXT,
  data JSONB, -- flexible data for each event
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update Issues table with missing columns
ALTER TABLE issues 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS code_snippet TEXT,
ADD COLUMN IF NOT EXISTS ai_prompt TEXT;

-- Enable RLS on new tables
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;

-- Policies for repositories
CREATE POLICY "Users can view their own repositories." ON repositories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own repositories." ON repositories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own repositories." ON repositories
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for agent_events
CREATE POLICY "Users can view agent events for their scans." ON agent_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = agent_events.scan_id
      AND scans.user_id = auth.uid()
    )
  );

-- Enable Realtime
-- Note: This requires superuser or specific permissions, usually done in the Supabase Dashboard
-- But as an SQL command for reference:
-- ALTER PUBLICATION supabase_realtime ADD TABLE agent_events;
-- ALTER PUBLICATION supabase_realtime ADD TABLE scans;
