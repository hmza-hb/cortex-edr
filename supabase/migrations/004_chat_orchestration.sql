-- ============================================================
-- MODULE 4: CHAT ORCHESTRATION SYSTEM
-- ============================================================

-- 1. Conversation Containers
CREATE TABLE IF NOT EXISTS chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    title TEXT,
    last_scan_id UUID REFERENCES scans(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Granular Messaging
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES chat_threads(id) ON DELETE CASCADE NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    attachments JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Public Sharing Protocol
CREATE TABLE IF NOT EXISTS chat_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES chat_threads(id) ON DELETE CASCADE NOT NULL,
    user_id TEXT NOT NULL,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Automatic Thread Synchronization
CREATE OR REPLACE FUNCTION set_chat_threads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_threads SET updated_at = NOW() WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_chat_threads_updated_at ON chat_messages;
CREATE TRIGGER trg_chat_threads_updated_at
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE PROCEDURE set_chat_threads_updated_at();

-- 5. Performance Indices
CREATE INDEX IF NOT EXISTS idx_chat_threads_user_updated_at ON chat_threads(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread_time ON chat_messages(thread_id, created_at ASC);

-- 6. Security
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat threads." ON chat_threads FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage messages in their threads." ON chat_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM chat_threads WHERE chat_threads.id = chat_messages.thread_id AND chat_threads.user_id = auth.uid()::text)
);
CREATE POLICY "Public can view shared chats." ON chat_shares FOR SELECT USING (true);
CREATE POLICY "Users can create their own shares." ON chat_shares FOR INSERT WITH CHECK (auth.uid()::text = user_id);
