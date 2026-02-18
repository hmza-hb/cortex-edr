-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Migration: Intelligent Agent System
-- Adds columns for AI analysis results
-- and interaction logging table.
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Add new columns to scans table for AI analysis
ALTER TABLE scans ADD COLUMN IF NOT EXISTS executive_report JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS severity_counts JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS issue_counts JSONB;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS recon_data JSONB;

-- Add new columns to issues table for richer metadata
ALTER TABLE issues ADD COLUMN IF NOT EXISTS line_number INTEGER;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS metadata JSONB;

-- AI interaction logs for full observability
CREATE TABLE IF NOT EXISTS ai_interaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE NOT NULL,
  log_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_logs_scan ON ai_interaction_logs(scan_id);

-- Allow service role to insert AI logs
ALTER TABLE ai_interaction_logs ENABLE ROW LEVEL SECURITY;

-- Policy: service role can do everything (via service key)
-- Users can read logs for their own scans
CREATE POLICY "Users can view AI logs for their scans." ON ai_interaction_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = ai_interaction_logs.scan_id
      AND scans.user_id = auth.uid()
    )
  );
