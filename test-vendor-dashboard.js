const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000';

async function testVendorDashboard() {
  try {
    console.log('Testing vendor dashboard data...');
    
    // Login as vendor
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'israelopoku360@gmail.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (!loginData.token) {
      throw new Error('Login failed');
    }
    
    console.log('✅ Login successful');
    console.log('User ID:', loginData.user.id);
    console.log('Business Name:', loginData.user.business_name);
    
    // Test vendor payments endpoint
    console.log('\n🔍 Testing vendor payments...');
    const paymentsResponse = await fetch(`${API_BASE}/api/vendors/${loginData.user.id}/payments`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    if (paymentsResponse.ok) {
      const payments = await paymentsResponse.json();
      console.log(`💰 Found ${payments.length} payments`);
      
      if (payments.length > 0) {
        console.log('Recent payment:', {
          id: payments[0].id,
          reference: payments[0].reference,
          amount: payments[0].amount,
          status: payments[0].status,
          method: payments[0].payment_method,
          created: payments[0].created_at
        });
      }
    } else {
      console.log('❌ Payments endpoint failed:', paymentsResponse.status);
    }
    
    // Test vendor payouts endpoint
    console.log('\n💸 Testing vendor payouts...');
    const payoutsResponse = await fetch(`${API_BASE}/api/vendors/${loginData.user.id}/payouts`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    if (payoutsResponse.ok) {
      const payouts = await payoutsResponse.json();
      console.log(`💸 Found ${payouts.length} payouts`);
      
      if (payouts.length > 0) {
        console.log('Recent payout:', {
          id: payouts[0].id,
          amount: payouts[0].amount,
          status: payouts[0].status,
          momo_number: payouts[0].momo_number,
          created: payouts[0].created_at
        });
      }
    } else {
      console.log('❌ Payouts endpoint failed:', payoutsResponse.status);
    }
    
    // Test vendor orders endpoint
    console.log('\n📦 Testing vendor orders...');
    const ordersResponse = await fetch(`${API_BASE}/api/orders?vendor=${loginData.user.id}`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    if (ordersResponse.ok) {
      const orders = await ordersResponse.json();
      console.log(`📦 Found ${orders.length} orders`);
      
      if (orders.length > 0) {
        console.log('Recent order:', {
          id: orders[0].id,
          total_amount: orders[0].total_amount,
          status: orders[0].status,
          buyer_id: orders[0].buyer_id,
          created: orders[0].created_at
        });
      }
    } else {
      console.log('❌ Orders endpoint failed:', ordersResponse.status);
    }
    
    // Test vendor stats endpoint
    console.log('\n📊 Testing vendor stats...');
    const statsResponse = await fetch(`${API_BASE}/api/vendors/${loginData.user.id}/stats`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('📊 Stats:', {
        totalSales: stats.totalSales,
        totalOrders: stats.totalOrders,
        totalProducts: stats.totalProducts,
        pendingPayouts: stats.pendingPayouts
      });
    } else {
      console.log('❌ Stats endpoint failed:', statsResponse.status);
    }
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testVendorDashboard();