-- Drop the old issues table if it exists
DROP TABLE IF EXISTS issues CASCADE;

-- Create the correct issues table with agent_id
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE NOT NULL,
  agent_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  line_number INTEGER,
  code_snippet TEXT,
  fix_suggestion TEXT,
  ai_prompt TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for fast queries
CREATE INDEX idx_issues_scan_id ON issues(scan_id);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_category ON issues(category);

-- Add enterprise_report column to scans
ALTER TABLE scans ADD COLUMN IF NOT EXISTS enterprise_report JSONB;

-- Add a view for enterprise reporting
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
