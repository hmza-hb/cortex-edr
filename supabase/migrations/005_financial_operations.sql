-- ============================================================
-- MODULE 5: FINANCIAL OPERATIONS & USAGE ANALYTICS
-- ============================================================

-- 1. Profile Financial Extensions
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'expired'));
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS payment_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'manual' CHECK (payment_method IN ('manual', 'bank_transfer', 'crypto', 'stripe', 'paypal'));
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime'));
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- 2. Ledger & Transaction History
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('payment_received', 'payment_verified', 'payment_rejected', 'tier_upgraded', 'tier_downgraded', 'payment_expired', 'tier_updated')),
    amount NUMERIC(10,2),
    payment_method TEXT,
    payment_status TEXT,
    billing_cycle TEXT,
    old_tier TEXT,
    new_tier TEXT,
    notes TEXT,
    verified_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Payment Submissions (Manual Checkout)
CREATE TABLE IF NOT EXISTS payment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT,
    tier_id TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    proof_url TEXT,
    transaction_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Billing Infrastructure
CREATE TABLE IF NOT EXISTS billing_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    stripe_invoice_id TEXT UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
    hosted_url TEXT,
    pdf_url TEXT,
    billing_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Deep Usage Tracking
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    scan_id UUID REFERENCES scans(id) ON DELETE SET NULL,
    thread_id UUID REFERENCES chat_threads(id) ON DELETE SET NULL,
    model_id TEXT NOT NULL,
    prompt_tokens INTEGER DEFAULT 0,
    response_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    cost_usd NUMERIC(10, 6) DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    source TEXT CHECK (source IN ('scan', 'chat', 'system')),
    agent_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Pre-aggregated Intelligence
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    date DATE NOT NULL,
    total_scans INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    accumulated_cost_usd NUMERIC(10, 6) DEFAULT 0,
    unique_repos_scanned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 7. Logic: Payment Auditing
CREATE OR REPLACE FUNCTION log_payment_change(
    p_user_email TEXT,
    p_action TEXT,
    p_amount NUMERIC DEFAULT NULL,
    p_payment_method TEXT DEFAULT NULL,
    p_old_tier TEXT DEFAULT NULL,
    p_new_tier TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_verified_by TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO payment_history (
        user_email,
        user_id,
        action,
        amount,
        payment_method,
        old_tier,
        new_tier,
        notes,
        verified_by
    ) VALUES (
        p_user_email,
        (SELECT id::text FROM users WHERE email = p_user_email LIMIT 1),
        p_action,
        p_amount,
        p_payment_method,
        p_old_tier,
        p_new_tier,
        p_notes,
        p_verified_by
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Performance & Security
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_time ON usage_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own financial data" ON payment_history FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage their own submissions" ON payment_submissions FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view their own invoices" ON billing_invoices FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view their own usage" ON usage_logs FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view their own stats" ON analytics_daily_stats FOR SELECT USING (auth.uid()::text = user_id);

-- 9. Storage Configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('billing_assets', 'billing_assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can manage their own receipts"
ON storage.objects FOR ALL
USING (bucket_id = 'billing_assets' AND (storage.foldername(name))[1] = 'payment_proofs');
