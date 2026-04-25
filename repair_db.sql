-- MODULE: DATABASE SYNC & RECOVERY
-- Purpose: Restores structural integrity after schema mismatch

-- 1. FIX ISSUES TABLE (Add missing analytical columns)
ALTER TABLE issues ADD COLUMN IF NOT EXISTS agent_id INTEGER;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS code_snippet TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS ai_prompt TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 2. FIX SCANS TABLE (Add missing intelligence columns)
ALTER TABLE scans ADD COLUMN IF NOT EXISTS current_agent INTEGER DEFAULT 0;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS total_issues INTEGER DEFAULT 0;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS total_lines INTEGER DEFAULT 0;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS executive_report JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS enterprise_report JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS severity_counts JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS issue_counts JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS recon_data JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS architecture_map TEXT;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS application_story TEXT;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS strengths JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS annotated_file_tree JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS repo_name TEXT;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS error TEXT;

-- 3. FIX STATUS CONSTRAINT (Ensure 'processing' and 'running' are both supported)
ALTER TABLE scans DROP CONSTRAINT IF EXISTS scans_status_check;
ALTER TABLE scans ADD CONSTRAINT scans_status_check CHECK (status IN ('pending', 'processing', 'running', 'completed', 'failed'));

-- 4. ENSURE AGENT_EVENTS EXISTS (Required for Live Audit Frontend)
CREATE TABLE IF NOT EXISTS agent_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    agent_id INTEGER,
    agent_name TEXT,
    event_type TEXT,
    message TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. REFRESH RLS (Security Layer)
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view agent events." ON agent_events;
CREATE POLICY "Users can view agent events." ON agent_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM scans WHERE scans.id = agent_events.scan_id AND (scans.user_id = auth.uid()::text OR auth.role() = 'service_role'))
);

-- 6. INDEXING (Performance Layer)
CREATE INDEX IF NOT EXISTS idx_issues_scan_id ON issues(scan_id);
CREATE INDEX IF NOT EXISTS idx_agent_events_scan_id ON agent_events(scan_id);
