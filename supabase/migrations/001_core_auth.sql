-- ============================================================
-- MODULE 1: CORE AUTHENTICATION (AUTH.JS & OTP)
-- ============================================================

-- 1. Create Auth.js Core Tables
CREATE TABLE IF NOT EXISTS users (
  id           uuid NOT NULL DEFAULT gen_random_uuid(),
  name         text,
  email        text,
  "emailVerified" timestamp with time zone,
  image        text,
  password     text,
  created_at   timestamp with time zone DEFAULT now(),
  updated_at   timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS accounts (
  id                 uuid NOT NULL DEFAULT gen_random_uuid(),
  "userId"           uuid NOT NULL,
  type               text NOT NULL,
  provider           text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token      text,
  access_token       text,
  expires_at         integer,
  token_type         text,
  scope              text,
  id_token           text,
  session_state      text,
  oauth_token_secret text,
  oauth_token        text,
  PRIMARY KEY (id),
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS sessions (
  id           uuid NOT NULL DEFAULT gen_random_uuid(),
  expires      timestamp with time zone NOT NULL,
  "userId"     uuid NOT NULL,
  "sessionToken" text NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE ("sessionToken")
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier text NOT NULL,
  token      text NOT NULL,
  expires    timestamp with time zone NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 2. OTP Verification Storage
CREATE TABLE IF NOT EXISTS public.auth_codes (
  email      text PRIMARY KEY,
  code       text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  attempts   integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Utility Functions
CREATE OR REPLACE FUNCTION public.cleanup_expired_auth_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.auth_codes WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Indices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions("userId");

-- 5. Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own auth data" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Service role only access for auth_codes" ON public.auth_codes FOR ALL USING (true) WITH CHECK (true);
