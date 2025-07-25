// Test the manual sync endpoint
const API_BASE = 'http://localhost:5000';

async function testManualSync() {
  console.log('Testing manual Paystack sync...');
  
  try {
    // First, login to get a token
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'israelopoku360@gmail.com',
        password: 'password123'
      })
    });

    console.log('Login response status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      console.error('Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData.user?.email);
    
    // Now test the manual sync
    const syncResponse = await fetch(`${API_BASE}/api/sync/manual`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Sync response status:', syncResponse.status);
    
    const syncData = await syncResponse.json();
    console.log('Sync response:', syncData);
    
    if (syncData.success) {
      console.log('✅ Manual sync completed successfully!');
      
      // Test fetching payments to verify sync worked
      const paymentsResponse = await fetch(`${API_BASE}/api/payments`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        console.log(`Found ${paymentsData.length} payments after sync`);
      }
      
      // Test fetching payouts to verify sync worked
      const payoutsResponse = await fetch(`${API_BASE}/api/payouts`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (payoutsResponse.ok) {
        const payoutsData = await payoutsResponse.json();
        console.log(`Found ${payoutsData.length} payouts after sync`);
      }
    } else {
      console.error('❌ Manual sync failed:', syncData.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testManualSync().then(() => {
  console.log('Test completed');
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});