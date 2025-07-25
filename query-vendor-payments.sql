-- Query to get payment and order data for vendor dashboard
SELECT 
  p.id,
  p.reference,
  p.amount,
  p.currency,
  p.payment_method,
  p.status,
  p.paystack_reference,
  p.gateway_response,
  p.mobile_number,
  p.network_provider,
  p.created_at,
  p.paid_at,
  -- Order information
  o.id as order_id,
  o.quantity,
  o.total_amount as order_total,
  o.status as order_status,
  o.shipping_address,
  o.phone as order_phone,
  o.notes,
  -- Buyer information
  u.full_name as buyer_name,
  u.email as buyer_email,
  u.phone as buyer_phone,
  u.whatsapp as buyer_whatsapp,
  -- Product information
  pr.title as product_title,
  pr.price as product_price
FROM payments p
LEFT JOIN orders o ON p.order_id = o.id
LEFT JOIN users u ON p.buyer_id = u.id
LEFT JOIN products pr ON o.product_id = pr.id
WHERE p.vendor_id = '6fac5f0f-9522-49c2-a131-60bf330545d5'
ORDER BY p.created_at DESC
LIMIT 20;

-- Query to get payout data for vendor dashboard
SELECT 
  po.id,
  po.amount,
  po.status,
  po.momo_number,
  po.transaction_id,
  po.created_at,
  po.updated_at
FROM payouts po
WHERE po.vendor_id = '6fac5f0f-9522-49c2-a131-60bf330545d5'
ORDER BY po.created_at DESC
LIMIT 20;

-- Query to get recent orders for vendor dashboard
SELECT 
  o.id,
  o.buyer_id,
  o.vendor_id,
  o.product_id,
  o.quantity,
  o.total_amount,
  o.status,
  o.shipping_address,
  o.phone,
  o.notes,
  o.created_at,
  o.updated_at,
  -- Buyer information
  u.full_name as buyer_name,
  u.email as buyer_email,
  u.phone as buyer_phone,
  u.whatsapp as buyer_whatsapp,
  -- Product information
  pr.title as product_title,
  pr.price as product_price,
  pr.image_url as product_image
FROM orders o
LEFT JOIN users u ON o.buyer_id = u.id
LEFT JOIN products pr ON o.product_id = pr.id
WHERE o.vendor_id = '6fac5f0f-9522-49c2-a131-60bf330545d5'
ORDER BY o.created_at DESC
LIMIT 10;