// Test sync with proper vendor mapping based on subaccount
const API_BASE = 'http://localhost:5000';

async function testSyncWithVendorMapping() {
  console.log('Testing Paystack sync with vendor mapping...');
  
  try {
    // Login
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'israelopoku360@gmail.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.error('Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    
    // Run sync
    const syncResponse = await fetch(`${API_BASE}/api/sync/manual`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!syncResponse.ok) {
      console.error('Sync failed');
      return;
    }

    const syncData = await syncResponse.json();
    console.log('✅ Sync completed:', syncData.message);
    
    // Check payments after sync
    const paymentsResponse = await fetch(`${API_BASE}/api/payments`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    if (paymentsResponse.ok) {
      const paymentsData = await paymentsResponse.json();
      console.log(`\n💰 Found ${paymentsData.length} payments:`);
      
      paymentsData.forEach((payment, index) => {
        console.log(`${index + 1}. ${payment.paystack_reference} - ${payment.amount} ${payment.currency} - ${payment.status}`);
      });
    }
    
    // Check vendor stats
    const vendorStatsResponse = await fetch(`${API_BASE}/api/vendors/${loginData.user.id}/stats`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    if (vendorStatsResponse.ok) {
      const statsData = await vendorStatsResponse.json();
      console.log(`\n📊 Vendor Stats:`);
      console.log(`Total Sales: ${statsData.totalSales}`);
      console.log(`Total Orders: ${statsData.totalOrders}`);
      console.log(`Total Products: ${statsData.totalProducts}`);
      console.log(`Pending Payouts: ${statsData.pendingPayouts}`);
    }
    
    // Check vendor dashboard with payments
    const vendorPaymentsResponse = await fetch(`${API_BASE}/api/vendors/${loginData.user.id}/payments`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    if (vendorPaymentsResponse.ok) {
      const vendorPaymentsData = await vendorPaymentsResponse.json();
      console.log(`\n💸 Vendor Payments: ${vendorPaymentsData.length}`);
      
      if (vendorPaymentsData.length > 0) {
        vendorPaymentsData.slice(0, 3).forEach((payment, index) => {
          console.log(`${index + 1}. ${payment.reference} - ${payment.amount} ${payment.currency} - ${payment.status}`);
        });
      }
    }
    
    console.log('\n✅ Sync test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSyncWithVendorMapping().then(() => {
  console.log('Test completed');
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});