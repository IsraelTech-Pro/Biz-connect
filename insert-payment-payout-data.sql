-- Insert the actual payment record from your successful transaction
INSERT INTO payments (
  id,
  reference,
  order_id,
  vendor_id,
  buyer_id,
  amount,
  currency,
  payment_method,
  status,
  mobile_number,
  network_provider,
  paystack_reference,
  authorization_url,
  access_code,
  gateway_response,
  paid_at,
  created_at,
  updated_at
) VALUES (
  'f3a774a2-9eee-44a3-bb53-d4eeaea38df5',
  'VH_1752117543289_sfa6ows83',
  '659ff927-ddf4-49b4-a9c9-0cc4653d68af',
  '6fac5f0f-9522-49c2-a131-60bf330545d5',
  '1f6a02c0-436c-45b8-97cb-a8d56ff01568',
  0.20,
  'GHS',
  'mobile_money',
  'success',
  '233551035300',
  'mtn',
  'VH_1752117543289_sfa6ows83',
  'https://checkout.paystack.com/z6ohe8djnvrbb54',
  'z6ohe8djnvrbb54',
  'Approved',
  '2025-07-10 03:19:40+00',
  '2025-07-10 03:19:03+00',
  '2025-07-10 03:19:40+00'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  paid_at = EXCLUDED.paid_at,
  updated_at = EXCLUDED.updated_at;

-- Insert sample payout data for testing the dashboard
INSERT INTO payouts (
  id,
  vendor_id,
  amount,
  status,
  momo_number,
  transaction_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '6fac5f0f-9522-49c2-a131-60bf330545d5', -- Vex vendor
  0.18, -- Amount minus platform fee (10%)
  'pending',
  '0551035300',
  'TXN_VH_1752117543289_PAYOUT',
  '2025-07-10 03:20:00+00',
  '2025-07-10 03:20:00+00'
);

-- Insert a completed payout for testing
INSERT INTO payouts (
  id,
  vendor_id,
  amount,
  status,
  momo_number,
  transaction_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '6fac5f0f-9522-49c2-a131-60bf330545d5',
  1.50,
  'success',
  '0551035300',
  'TXN_PREV_PAYOUT_001',
  '2025-07-09 15:30:00+00',
  '2025-07-09 15:30:00+00'
);

-- Insert another pending payout
INSERT INTO payouts (
  id,
  vendor_id,
  amount,
  status,
  momo_number,
  transaction_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '6fac5f0f-9522-49c2-a131-60bf330545d5',
  0.85,
  'pending',
  '0551035300',
  'TXN_PREV_PAYOUT_002',
  '2025-07-08 12:15:00+00',
  '2025-07-08 12:15:00+00'
);

-- Verify the data was inserted
SELECT 'Payment Records for Vendor:' as info;
SELECT 
  id,
  reference,
  amount,
  currency,
  payment_method,
  status,
  paystack_reference,
  created_at
FROM payments 
WHERE vendor_id = '6fac5f0f-9522-49c2-a131-60bf330545d5'
ORDER BY created_at DESC;

SELECT 'Payout Records for Vendor:' as info;
SELECT 
  id,
  amount,
  status,
  momo_number,
  transaction_id,
  created_at
FROM payouts 
WHERE vendor_id = '6fac5f0f-9522-49c2-a131-60bf330545d5'
ORDER BY created_at DESC;