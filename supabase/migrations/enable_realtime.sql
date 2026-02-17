-- CRITICAL: Enable Realtime for both tables
-- Run this in Supabase SQL Editor

-- 1. Enable Realtime on agent_events table
ALTER TABLE agent_events REPLICA IDENTITY FULL;

-- 2. Enable Realtime on scans table  
ALTER TABLE scans REPLICA IDENTITY FULL;

-- 3. Add to replication publication safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'agent_events'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE agent_events;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'scans'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE scans;
    END IF;
END $$;
