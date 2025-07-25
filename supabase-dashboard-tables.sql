-- Create comprehensive database schema for Paystack synchronization and dashboard functionality

-- 1. Create transactions table for Paystack transaction sync
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paystack_id BIGINT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GHS',
    reference VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    gateway_response TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    channel VARCHAR(50),
    -- Customer information
    customer_id BIGINT,
    customer_email VARCHAR(255),
    customer_first_name VARCHAR(100),
    customer_last_name VARCHAR(100),
    -- Metadata from Paystack
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    item VARCHAR(255),
    vendor_contact VARCHAR(20),
    delivery_time TIMESTAMP WITH TIME ZONE,
    -- Subaccount information
    subaccount_id BIGINT,
    subaccount_code VARCHAR(50),
    business_name VARCHAR(255)
);

-- 2. Create paystack_transfers table for payout tracking
CREATE TABLE IF NOT EXISTS paystack_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paystack_id BIGINT UNIQUE NOT NULL,
    transfer_code VARCHAR(100) UNIQUE NOT NULL,
    reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GHS',
    status VARCHAR(50) DEFAULT 'pending',
    reason TEXT,
    -- Recipient information
    recipient_id BIGINT,
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    account_number VARCHAR(20),
    account_name VARCHAR(255),
    bank_name VARCHAR(255),
    bank_code VARCHAR(10),
    -- Timing
    transferred_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Link to vendor
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    -- Link to original payout request
    payout_id UUID REFERENCES payouts(id) ON DELETE SET NULL
);

-- 3. Create paystack_balance table for balance tracking
CREATE TABLE IF NOT EXISTS paystack_balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    currency VARCHAR(3) DEFAULT 'GHS',
    balance DECIMAL(15,2) NOT NULL,
    subaccount_code VARCHAR(50),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- For main account balance, subaccount_code will be NULL
    -- For subaccount balance, subaccount_code will contain the code
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create paystack_settlements table for settlement tracking
CREATE TABLE IF NOT EXISTS paystack_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paystack_id BIGINT UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    currency VARCHAR(3) DEFAULT 'GHS',
    integration_id BIGINT,
    total_amount DECIMAL(15,2) NOT NULL,
    effective_amount DECIMAL(15,2) NOT NULL,
    total_fees DECIMAL(15,2) DEFAULT 0,
    total_processed DECIMAL(15,2) DEFAULT 0,
    deductions DECIMAL(15,2) DEFAULT 0,
    settlement_date TIMESTAMP WITH TIME ZONE,
    settled_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Subaccount information
    subaccount_id BIGINT,
    subaccount_code VARCHAR(50),
    business_name VARCHAR(255),
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Ensure users table has required Paystack fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS paystack_subaccount VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS paystack_customer_id BIGINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS recipient_code VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

-- 6. Update existing payouts table with Paystack fields
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS paystack_transfer_id BIGINT;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS transfer_code VARCHAR(100);
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS recipient_code VARCHAR(100);
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS reason TEXT;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS paystack_status VARCHAR(50);
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS transferred_at TIMESTAMP WITH TIME ZONE;

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_paystack_id ON transactions(paystack_id);
CREATE INDEX IF NOT EXISTS idx_transactions_vendor_id ON transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_paid_at ON transactions(paid_at);
CREATE INDEX IF NOT EXISTS idx_transactions_subaccount_code ON transactions(subaccount_code);

CREATE INDEX IF NOT EXISTS idx_paystack_transfers_paystack_id ON paystack_transfers(paystack_id);
CREATE INDEX IF NOT EXISTS idx_paystack_transfers_vendor_id ON paystack_transfers(vendor_id);
CREATE INDEX IF NOT EXISTS idx_paystack_transfers_transfer_code ON paystack_transfers(transfer_code);
CREATE INDEX IF NOT EXISTS idx_paystack_transfers_status ON paystack_transfers(status);
CREATE INDEX IF NOT EXISTS idx_paystack_transfers_transferred_at ON paystack_transfers(transferred_at);

CREATE INDEX IF NOT EXISTS idx_paystack_balance_subaccount_code ON paystack_balance(subaccount_code);
CREATE INDEX IF NOT EXISTS idx_paystack_balance_vendor_id ON paystack_balance(vendor_id);
CREATE INDEX IF NOT EXISTS idx_paystack_balance_recorded_at ON paystack_balance(recorded_at);

CREATE INDEX IF NOT EXISTS idx_paystack_settlements_paystack_id ON paystack_settlements(paystack_id);
CREATE INDEX IF NOT EXISTS idx_paystack_settlements_vendor_id ON paystack_settlements(vendor_id);
CREATE INDEX IF NOT EXISTS idx_paystack_settlements_subaccount_code ON paystack_settlements(subaccount_code);
CREATE INDEX IF NOT EXISTS idx_paystack_settlements_settlement_date ON paystack_settlements(settlement_date);

CREATE INDEX IF NOT EXISTS idx_users_paystack_subaccount ON users(paystack_subaccount);
CREATE INDEX IF NOT EXISTS idx_users_paystack_customer_id ON users(paystack_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_recipient_code ON users(recipient_code);

CREATE INDEX IF NOT EXISTS idx_payouts_paystack_transfer_id ON payouts(paystack_transfer_id);
CREATE INDEX IF NOT EXISTS idx_payouts_transfer_code ON payouts(transfer_code);
CREATE INDEX IF NOT EXISTS idx_payouts_paystack_status ON payouts(paystack_status);

-- 8. Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_paystack_transfers_updated_at ON paystack_transfers;
CREATE TRIGGER update_paystack_transfers_updated_at
    BEFORE UPDATE ON paystack_transfers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_paystack_settlements_updated_at ON paystack_settlements;
CREATE TRIGGER update_paystack_settlements_updated_at
    BEFORE UPDATE ON paystack_settlements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Enable Row Level Security (RLS) for security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE paystack_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE paystack_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE paystack_settlements ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies for data access control
-- Transactions: Users can see their own transactions (as buyer or vendor)
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (
        buyer_id = auth.uid() OR 
        vendor_id = auth.uid()
    );

-- Transfers: Vendors can see their own transfers
CREATE POLICY "Vendors can view own transfers" ON paystack_transfers
    FOR SELECT USING (vendor_id = auth.uid());

-- Balance: Vendors can see their own balance
CREATE POLICY "Vendors can view own balance" ON paystack_balance
    FOR SELECT USING (vendor_id = auth.uid());

-- Settlements: Vendors can see their own settlements
CREATE POLICY "Vendors can view own settlements" ON paystack_settlements
    FOR SELECT USING (vendor_id = auth.uid());

-- 12. Create admin policies for system operations
CREATE POLICY "Admin can manage all transactions" ON transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admin can manage all transfers" ON paystack_transfers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admin can manage all balance records" ON paystack_balance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admin can manage all settlements" ON paystack_settlements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- 13. Update existing users with WhatsApp numbers based on phone numbers
UPDATE users 
SET whatsapp = phone 
WHERE whatsapp IS NULL AND phone IS NOT NULL;

COMMIT;