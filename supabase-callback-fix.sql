-- Fix database schema for dashboard functionality
-- This ensures all tables exist and have the right structure

-- Ensure users table has all required columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS paystack_subaccount VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

-- Create transactions table for Paystack sync
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GHS',
    email VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reference VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    delivery_time TIMESTAMP WITH TIME ZONE,
    vendor_contact VARCHAR(20),
    paystack_id BIGINT UNIQUE,
    gateway_response TEXT,
    channel VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Update payouts table to include Paystack fields
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS paystack_id BIGINT UNIQUE;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS recipient_code VARCHAR(100);
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS transfer_code VARCHAR(100);
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS reason TEXT;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS subaccount_code VARCHAR(50);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_vendor_id ON transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_paid_at ON transactions(paid_at);
CREATE INDEX IF NOT EXISTS idx_transactions_paystack_id ON transactions(paystack_id);

CREATE INDEX IF NOT EXISTS idx_payouts_vendor_id ON payouts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_payouts_subaccount_code ON payouts(subaccount_code);
CREATE INDEX IF NOT EXISTS idx_payouts_paystack_id ON payouts(paystack_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies for security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Buyers can only see their own transactions, vendors can see their sales
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (
        buyer_id = auth.uid() OR 
        vendor_id = auth.uid()
    );

-- Only authenticated users can insert/update transactions
CREATE POLICY "Authenticated users can insert transactions" ON transactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update transactions" ON transactions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Update existing users to have WhatsApp numbers based on phone numbers
UPDATE users 
SET whatsapp = phone 
WHERE whatsapp IS NULL AND phone IS NOT NULL;

COMMIT;