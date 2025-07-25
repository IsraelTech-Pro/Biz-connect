// Test script to verify the complete payment flow
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testPaymentFlow() {
  console.log('Testing Payment Flow...\n');

  // Step 1: Login to get auth token
  console.log('1. Logging in...');
  const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });

  const loginData = await loginResponse.json();
  console.log('Login response:', loginData);

  if (!loginData.token) {
    console.error('Login failed');
    return;
  }

  const authToken = loginData.token;
  const userId = loginData.user.id;

  // Step 2: Create a payment record directly using the storage
  console.log('\n2. Creating payment record directly...');
  const paymentReference = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const createPaymentResponse = await fetch(`${BASE_URL}/api/payments/test-create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      reference: paymentReference,
      amount: 10.00,
      currency: 'GHS',
      payment_method: 'card',
      vendor_id: userId,
      buyer_id: userId,
      status: 'pending'
    })
  });

  const paymentData = await createPaymentResponse.json();
  console.log('Payment creation response:', paymentData);

  // Step 3: Test the callback with the created payment
  console.log('\n3. Testing payment callback...');
  const callbackResponse = await fetch(`${BASE_URL}/api/payments/callback?reference=${paymentReference}&trxref=${paymentReference}`, {
    method: 'GET',
    redirect: 'manual'
  });

  console.log('Callback response status:', callbackResponse.status);
  console.log('Callback response headers:', callbackResponse.headers.get('location'));

  // Step 4: Check payment status after callback
  console.log('\n4. Checking payment status...');
  const statusResponse = await fetch(`${BASE_URL}/api/payments/status/${paymentReference}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  const statusData = await statusResponse.json();
  console.log('Payment status response:', statusData);

  console.log('\nTest completed!');
}

testPaymentFlow().catch(console.error);