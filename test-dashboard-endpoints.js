// Test dashboard endpoints
const testDashboardEndpoints = async () => {
  const baseUrl = 'http://localhost:5000';
  
  // Test login first - let's try to get the current user
  console.log('Testing current user authentication...');
  const currentUserResponse = await fetch(`${baseUrl}/api/auth/me`);
  
  if (currentUserResponse.ok) {
    const currentUser = await currentUserResponse.json();
    console.log('Current user:', currentUser.email, 'Role:', currentUser.role);
    
    // Test with current user's token (if available)
    if (currentUser.id) {
      console.log('\nTesting dashboard with current user...');
      await testDashboardWithUser(baseUrl, null, currentUser); // No token needed since user is already authenticated
      return;
    }
  }
  
  // Test login first
  console.log('Testing login...');
  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'vendorhub@example.com',
      password: 'password123'
    })
  });
  
  if (!loginResponse.ok) {
    console.error('Login failed:', await loginResponse.text());
    return;
  }
  
  const loginData = await loginResponse.json();
  const token = loginData.token;
  console.log('Login successful, token:', token ? 'received' : 'not received');
  
  if (!token) {
    console.error('No token received');
    return;
  }
  
  await testDashboardWithUser(baseUrl, token);
};

const testDashboardWithUser = async (baseUrl, token, currentUser = null) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  
  // Test buyer dashboard endpoints
  console.log('\nTesting buyer dashboard...');
  
  const buyerTransactionsResponse = await fetch(`${baseUrl}/api/dashboard/buyer/transactions`, {
    headers
  });
  
  if (buyerTransactionsResponse.ok) {
    const transactions = await buyerTransactionsResponse.json();
    console.log('Buyer transactions:', transactions.length, 'found');
  } else {
    console.error('Buyer transactions failed:', await buyerTransactionsResponse.text());
  }
  
  const buyerStatsResponse = await fetch(`${baseUrl}/api/dashboard/buyer/stats`, {
    headers
  });
  
  if (buyerStatsResponse.ok) {
    const stats = await buyerStatsResponse.json();
    console.log('Buyer stats:', stats);
  } else {
    console.error('Buyer stats failed:', await buyerStatsResponse.text());
  }
  
  // Test vendor dashboard endpoints (if user is vendor)
  if (!currentUser || currentUser.role === 'vendor') {
    console.log('\nTesting vendor dashboard...');
    
    const vendorTransactionsResponse = await fetch(`${baseUrl}/api/dashboard/vendor/transactions`, {
      headers
    });
    
    if (vendorTransactionsResponse.ok) {
      const transactions = await vendorTransactionsResponse.json();
      console.log('Vendor transactions:', transactions.length, 'found');
      if (transactions.length > 0) {
        console.log('Sample transaction:', transactions[0]);
      }
    } else {
      console.error('Vendor transactions failed:', await vendorTransactionsResponse.text());
    }
    
    const vendorPayoutsResponse = await fetch(`${baseUrl}/api/dashboard/vendor/payouts`, {
      headers
    });
    
    if (vendorPayoutsResponse.ok) {
      const payouts = await vendorPayoutsResponse.json();
      console.log('Vendor payouts:', payouts.length, 'found');
      if (payouts.length > 0) {
        console.log('Sample payout:', payouts[0]);
      }
    } else {
      console.error('Vendor payouts failed:', await vendorPayoutsResponse.text());
    }
    
    const vendorStatsResponse = await fetch(`${baseUrl}/api/dashboard/vendor/stats`, {
      headers
    });
    
    if (vendorStatsResponse.ok) {
      const stats = await vendorStatsResponse.json();
      console.log('Vendor stats:', stats);
    } else {
      console.error('Vendor stats failed:', await vendorStatsResponse.text());
    }
  }
  
  // Test manual Paystack sync
  console.log('\nTesting manual Paystack sync...');
  
  const syncResponse = await fetch(`${baseUrl}/api/sync/manual`, {
    method: 'POST',
    headers
  });
  
  if (syncResponse.ok) {
    const syncData = await syncResponse.json();
    console.log('Manual Paystack sync result:', syncData);
  } else {
    console.error('Manual Paystack sync failed:', await syncResponse.text());
  }
};

// Run the test
testDashboardEndpoints().catch(console.error);