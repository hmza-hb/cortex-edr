-- Add payment tracking to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'expired'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_date timestamp with time zone;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'manual' CHECK (payment_method IN ('manual', 'bank_transfer', 'crypto', 'stripe', 'paypal'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_verified_by text; -- Admin email who verified payment
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_notes text; -- Admin notes about payment
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime'));

-- Create payment history table for tracking all payment changes
CREATE TABLE IF NOT EXISTS payment_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    user_email text NOT NULL,
    action text NOT NULL CHECK (action IN ('payment_received', 'payment_verified', 'payment_rejected', 'tier_upgraded', 'tier_downgraded', 'payment_expired')),
    amount numeric(10,2),
    payment_method text,
    payment_status text,
    billing_cycle text,
    old_tier text,
    new_tier text,
    notes text,
    verified_by text, -- Admin email
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on payment_history
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Policies for payment_history
CREATE POLICY "Admins can view all payment history" ON payment_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN ('hmza.hb82@gmail.com')
        )
    );

CREATE POLICY "Admins can insert payment history" ON payment_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN ('hmza.hb82@gmail.com')
        )
    );

-- Function to log payment history
CREATE OR REPLACE FUNCTION log_payment_change(
    p_user_email text,
    p_action text,
    p_amount numeric DEFAULT NULL,
    p_payment_method text DEFAULT NULL,
    p_old_tier text DEFAULT NULL,
    p_new_tier text DEFAULT NULL,
    p_notes text DEFAULT NULL,
    p_verified_by text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO payment_history (
        user_email,
        action,
        amount,
        payment_method,
        old_tier,
        new_tier,
        notes,
        verified_by
    ) VALUES (
        p_user_email,
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION log_payment_change TO authenticated;
