-- Sample data for existing database schema (payments, payouts, orders, users)
-- This script populates your database with realistic data to test the dashboard

-- Insert sample payments data
INSERT INTO payments (
    reference, 
    order_id, 
    vendor_id, 
    buyer_id, 
    amount, 
    currency, 
    payment_method, 
    mobile_number, 
    network_provider, 
    status, 
    paystack_reference, 
    gateway_response, 
    paid_at, 
    created_at
) VALUES 
-- Recent successful payments
(
    'VH_PAY_001',
    (SELECT id FROM orders LIMIT 1),
    (SELECT id FROM users WHERE role = 'vendor' LIMIT 1),
    (SELECT id FROM users WHERE role = 'buyer' LIMIT 1),
    125.50,
    'GHS',
    'mobile_money',
    '0551035300',
    'MTN',
    'success',
    'PS_VH_PAY_001',
    'Approved',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours'
),
(
    'VH_PAY_002',
    (SELECT id FROM orders LIMIT 1 OFFSET 1),
    (SELECT id FROM users WHERE role = 'vendor' LIMIT 1),
    (SELECT id FROM users WHERE role = 'buyer' LIMIT 1),
    89.99,
    'GHS',
    'mobile_money',
    '0241234567',
    'Vodafone',
    'success',
    'PS_VH_PAY_002',
    'Approved',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),
(
    'VH_PAY_003',
    (SELECT id FROM orders LIMIT 1 OFFSET 2),
    (SELECT id FROM users WHERE role = 'vendor' LIMIT 1),
    (SELECT id FROM users WHERE role = 'buyer' LIMIT 1),
    245.00,
    'GHS',
    'mobile_money',
    '0201234567',
    'AirtelTigo',
    'success',
    'PS_VH_PAY_003',
    'Approved',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
),
(
    'VH_PAY_004',
    (SELECT id FROM orders LIMIT 1 OFFSET 3),
    (SELECT id FROM users WHERE role = 'vendor' LIMIT 1),
    (SELECT id FROM users WHERE role = 'buyer' LIMIT 1),
    67.50,
    'GHS',
    'mobile_money',
    '0551234567',
    'MTN',
    'pending',
    'PS_VH_PAY_004',
    'Pending',
    NULL,
    NOW() - INTERVAL '30 minutes'
);

-- Insert sample payouts data
INSERT INTO payouts (
    vendor_id,
    amount,
    status,
    momo_number,
    transaction_id,
    created_at
) VALUES 
-- Recent successful payout
(
    (SELECT id FROM users WHERE role = 'vendor' LIMIT 1),
    425.00,
    'success',
    '0551035300',
    'TRF_success_001',
    NOW() - INTERVAL '1 day'
),
-- Pending payout
(
    (SELECT id FROM users WHERE role = 'vendor' LIMIT 1),
    125.50,
    'pending',
    '0551035300',
    'TRF_pending_001',
    NOW() - INTERVAL '2 hours'
),
-- Another successful payout
(
    (SELECT id FROM users WHERE role = 'vendor' LIMIT 1),
    200.00,
    'success',
    '0551035300',
    'TRF_success_002',
    NOW() - INTERVAL '1 week'
);

-- Update users table with WhatsApp and Paystack subaccount information
UPDATE users 
SET 
    whatsapp = CASE 
        WHEN phone IS NOT NULL THEN phone 
        ELSE '+233551035300' 
    END,
    paystack_subaccount = CASE 
        WHEN role = 'vendor' THEN 'ACCT_9ps6vd9cj34mi7p' 
        ELSE NULL 
    END
WHERE role IN ('vendor', 'buyer');

-- Update orders status to reflect processing
UPDATE orders 
SET 
    status = CASE 
        WHEN id IN (
            SELECT order_id FROM payments WHERE status = 'success'
        ) THEN 'completed'
        ELSE 'pending'
    END,
    updated_at = NOW()
WHERE created_at >= NOW() - INTERVAL '1 week';

-- Verify the data
SELECT 
    'Users' as table_name,
    COUNT(*) as count,
    COUNT(CASE WHEN role = 'vendor' THEN 1 END) as vendors,
    COUNT(CASE WHEN role = 'buyer' THEN 1 END) as buyers
FROM users

UNION ALL

SELECT 
    'Payments' as table_name,
    COUNT(*) as count,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
FROM payments

UNION ALL

SELECT 
    'Payouts' as table_name,
    COUNT(*) as count,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
FROM payouts

UNION ALL

SELECT 
    'Orders' as table_name,
    COUNT(*) as count,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
FROM orders;

-- Final verification query for vendor dashboard
SELECT 
    'Vendor Dashboard Data' as info,
    p.vendor_id,
    u.full_name as vendor_name,
    u.business_name,
    u.whatsapp,
    u.paystack_subaccount,
    COUNT(p.id) as total_payments,
    SUM(CASE WHEN p.status = 'success' THEN p.amount ELSE 0 END) as total_sales,
    COUNT(CASE WHEN p.status = 'success' THEN 1 END) as successful_payments,
    COUNT(CASE WHEN p.status = 'pending' THEN 1 END) as pending_payments
FROM payments p
JOIN users u ON p.vendor_id = u.id
WHERE u.role = 'vendor'
GROUP BY p.vendor_id, u.full_name, u.business_name, u.whatsapp, u.paystack_subaccount;