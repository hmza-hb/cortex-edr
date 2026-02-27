-- Phase 8: Chat Shares (Public Share Links)

CREATE TABLE IF NOT EXISTS chat_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES chat_threads(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_shares_user_id ON chat_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_shares_thread_id ON chat_shares(thread_id);
