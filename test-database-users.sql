-- Check current users in database
SELECT 
    id,
    email,
    full_name,
    role,
    business_name,
    paystack_subaccount,
    whatsapp,
    created_at
FROM users 
ORDER BY created_at DESC;

-- Check if we have any payments
SELECT 
    p.id,
    p.reference,
    p.amount,
    p.status,
    p.paystack_reference,
    u.email as buyer_email,
    v.business_name as vendor_name,
    p.created_at
FROM payments p
LEFT JOIN users u ON p.buyer_id = u.id
LEFT JOIN users v ON p.vendor_id = v.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Check if we have any payouts
SELECT 
    p.id,
    p.vendor_id,
    p.amount,
    p.status,
    p.transaction_id,
    u.business_name as vendor_name,
    p.created_at
FROM payouts p
LEFT JOIN users u ON p.vendor_id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Check if we have any orders
SELECT 
    o.id,
    o.buyer_id,
    o.vendor_id,
    o.total_amount,
    o.status,
    b.email as buyer_email,
    v.business_name as vendor_name,
    o.created_at
FROM orders o
LEFT JOIN users b ON o.buyer_id = b.id
LEFT JOIN users v ON o.vendor_id = v.id
ORDER BY o.created_at DESC
LIMIT 10;