-- ============================================================
-- MODULE 6: SYSTEM OPTIMIZATIONS & MAINTENANCE
-- ============================================================

-- 1. Realtime Infrastructure
ALTER TABLE IF EXISTS agent_events REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS scans REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS chat_messages REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'agent_events') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE agent_events;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'scans') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE scans;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
    END IF;
END $$;

-- 2. Performance: Composite Utility Indices
CREATE INDEX IF NOT EXISTS idx_scans_user_created_at ON scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_scan_severity ON issues(scan_id, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_events_time_lookup ON agent_events(scan_id, created_at ASC);

-- 3. Maintenance Protocols (Housekeeping)
CREATE OR REPLACE FUNCTION purge_old_transient_data()
RETURNS VOID AS $$
BEGIN
    -- Delete granular logs older than 7 days (Aggregated in daily_stats)
    DELETE FROM agent_events WHERE created_at < NOW() - INTERVAL '7 days';
    DELETE FROM usage_logs WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Global Hardening Constraints
DO $$ BEGIN
    ALTER TABLE scans ADD CONSTRAINT chk_scan_status_v3 CHECK (status IN ('pending', 'running', 'completed', 'failed'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE issues ADD CONSTRAINT chk_issue_severity_v3 CHECK (severity IN ('critical', 'high', 'medium', 'low', 'informational'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 5. Grant Execution
GRANT EXECUTE ON FUNCTION purge_old_transient_data() TO service_role;
