import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function addPaymentViaAPI() {
  try {
    // First, login to get auth token
    console.log('Logging in as vendor...');
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
    
    console.log('✅ Logged in successfully');
    
    // Create payment record via API
    console.log('Creating payment record...');
    const paymentResponse = await fetch(`${API_BASE}/api/payments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        id: 'f3a774a2-9eee-44a3-bb53-d4eeaea38df5',
        reference: 'VH_1752117543289_sfa6ows83',
        order_id: '659ff927-ddf4-49b4-a9c9-0cc4653d68af',
        vendor_id: '6fac5f0f-9522-49c2-a131-60bf330545d5',
        buyer_id: '1f6a02c0-436c-45b8-97cb-a8d56ff01568',
        amount: 0.20,
        currency: 'GHS',
        payment_method: 'mobile_money',
        status: 'success',
        mobile_number: '233551035300',
        network_provider: 'mtn',
        paystack_reference: 'VH_1752117543289_sfa6ows83',
        authorization_url: 'https://checkout.paystack.com/z6ohe8djnvrbb54',
        access_code: 'z6ohe8djnvrbb54',
        gateway_response: 'Approved'
      })
    });
    
    if (paymentResponse.ok) {
      const payment = await paymentResponse.json();
      console.log('✅ Payment created:', payment);
    } else {
      console.log('❌ Payment creation failed:', paymentResponse.status);
      const error = await paymentResponse.text();
      console.log('Error:', error);
    }
    
    // Update order with correct amount
    console.log('Updating order...');
    const orderResponse = await fetch(`${API_BASE}/api/orders/659ff927-ddf4-49b4-a9c9-0cc4653d68af`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        total_amount: 0.20,
        phone: '233551035300',
        shipping_address: 'Accra, Ghana',
        notes: 'Test order for payment integration'
      })
    });
    
    if (orderResponse.ok) {
      const order = await orderResponse.json();
      console.log('✅ Order updated:', order);
    } else {
      console.log('❌ Order update failed:', orderResponse.status);
    }
    
    // Verify the vendor payments
    console.log('Checking vendor payments...');
    const vendorPaymentsResponse = await fetch(`${API_BASE}/api/vendors/6fac5f0f-9522-49c2-a131-60bf330545d5/payments`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    if (vendorPaymentsResponse.ok) {
      const payments = await vendorPaymentsResponse.json();
      console.log('✅ Vendor payments:', payments.length);
      if (payments.length > 0) {
        console.log('Latest payment:', payments[0]);
      }
    }
    
  } catch (error) {
    console.error('API call failed:', error);
  }
}

addPaymentViaAPI();