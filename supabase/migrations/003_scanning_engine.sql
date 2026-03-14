-- ============================================================
-- MODULE 3: SCANNING ENGINE & INTELLIGENCE
-- ============================================================

-- 1. Repositories
CREATE TABLE IF NOT EXISTS repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    url TEXT NOT NULL,
    name TEXT,
    last_scan_id UUID,
    last_scanned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Core Scanning Logic
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    repo_name TEXT,
    repo_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    current_agent INTEGER DEFAULT 0,
    total_issues INTEGER DEFAULT 0,
    total_lines INTEGER DEFAULT 0,
    summary TEXT,
    error TEXT,
    
    -- Advanced Intelligence Data
    executive_report JSONB,
    enterprise_report JSONB,
    severity_counts JSONB,
    issue_counts JSONB,
    recon_data JSONB,
    architecture_map TEXT,
    application_story TEXT,
    strengths JSONB,
    annotated_file_tree JSONB,
    
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Agent Execution Events
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

-- 4. Vulnerability & Issue Tracking
CREATE TABLE IF NOT EXISTS issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE NOT NULL,
    agent_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'informational')),
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    line_number INTEGER,
    code_snippet TEXT,
    fix_suggestion TEXT,
    ai_prompt TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Intelligence Views
CREATE OR REPLACE VIEW issues_detailed AS
SELECT 
    i.*,
    CASE i.severity
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
        ELSE 5
    END as severity_rank
FROM issues i;

-- 6. Indices (Standard)
CREATE INDEX IF NOT EXISTS idx_issues_scan_id ON issues(scan_id);
CREATE INDEX IF NOT EXISTS idx_repositories_user_id ON repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_events_scan_id ON agent_events(scan_id);

-- 7. Security
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own repositories." ON repositories FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage their own scans." ON scans FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view agent events." ON agent_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM scans WHERE scans.id = agent_events.scan_id AND scans.user_id = auth.uid()::text)
);
CREATE POLICY "Users can view issues." ON issues FOR SELECT USING (
    EXISTS (SELECT 1 FROM scans WHERE scans.id = issues.scan_id AND scans.user_id = auth.uid()::text)
);
