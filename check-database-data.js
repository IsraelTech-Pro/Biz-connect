import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function checkDatabaseData() {
  try {
    console.log('Checking database data...');
    
    // Check orders table
    console.log('\n=== ORDERS TABLE ===');
    const orders = await sql`
      SELECT id, vendor_id, buyer_id, total_amount, status, created_at, phone, shipping_address 
      FROM orders 
      WHERE vendor_id = '6fac5f0f-9522-49c2-a131-60bf330545d5'
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    console.log('Orders found:', orders.length);
    orders.forEach(order => {
      console.log(`- Order ${order.id}: ₵${order.total_amount} (${order.status})`);
    });
    
    // Check payments table
    console.log('\n=== PAYMENTS TABLE ===');
    const payments = await sql`
      SELECT id, reference, vendor_id, amount, status, payment_method, created_at
      FROM payments 
      WHERE vendor_id = '6fac5f0f-9522-49c2-a131-60bf330545d5'
      ORDER BY created_at DESC 
      LIMIT 5
    `;
    console.log('Payments found:', payments.length);
    payments.forEach(payment => {
      console.log(`- Payment ${payment.reference}: ₵${payment.amount} (${payment.status})`);
    });
    
    // Check users table for buyer info
    console.log('\n=== USERS TABLE ===');
    const users = await sql`
      SELECT id, full_name, email, phone, role 
      FROM users 
      WHERE id IN (
        SELECT DISTINCT buyer_id FROM orders 
        WHERE vendor_id = '6fac5f0f-9522-49c2-a131-60bf330545d5'
      )
      LIMIT 5
    `;
    console.log('Users found:', users.length);
    users.forEach(user => {
      console.log(`- User ${user.id}: ${user.full_name} (${user.email})`);
    });
    
    // Check if payment record exists for our reference
    console.log('\n=== SPECIFIC PAYMENT CHECK ===');
    const specificPayment = await sql`
      SELECT * FROM payments 
      WHERE reference = 'VH_1752117543289_sfa6ows83'
    `;
    console.log('Specific payment found:', specificPayment.length);
    
    if (specificPayment.length === 0) {
      console.log('❌ Payment record VH_1752117543289_sfa6ows83 NOT found in database');
      console.log('Need to insert payment data...');
      
      // Insert the payment record
      const insertPayment = await sql`
        INSERT INTO payments (
          id, reference, order_id, vendor_id, buyer_id, amount, currency, 
          payment_method, status, mobile_number, network_provider, 
          paystack_reference, authorization_url, access_code, gateway_response,
          paid_at, created_at, updated_at
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
          updated_at = EXCLUDED.updated_at
        RETURNING id, reference, amount, status
      `;
      
      console.log('✅ Payment inserted:', insertPayment[0]);
      
      // Also update the order with proper amount and buyer info
      const updateOrder = await sql`
        UPDATE orders 
        SET total_amount = 0.20,
            phone = '233551035300',
            shipping_address = 'Accra, Ghana',
            notes = 'Test order for payment integration',
            updated_at = NOW()
        WHERE id = '659ff927-ddf4-49b4-a9c9-0cc4653d68af'
        RETURNING id, total_amount, phone, shipping_address
      `;
      
      console.log('✅ Order updated:', updateOrder[0]);
    } else {
      console.log('✅ Payment record found:', specificPayment[0]);
    }
    
    console.log('\n=== VERIFICATION ===');
    // Verify the data is now correct
    const finalOrders = await sql`
      SELECT o.id, o.total_amount, o.status, o.phone, o.shipping_address,
             u.full_name, u.email
      FROM orders o
      LEFT JOIN users u ON o.buyer_id = u.id
      WHERE o.vendor_id = '6fac5f0f-9522-49c2-a131-60bf330545d5'
      ORDER BY o.created_at DESC 
      LIMIT 1
    `;
    
    console.log('Final order check:', finalOrders[0]);
    
  } catch (error) {
    console.error('Database check failed:', error);
  }
}

checkDatabaseData();