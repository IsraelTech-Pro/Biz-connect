// Simple test to verify Paystack API connection
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET) {
  console.error('PAYSTACK_SECRET_KEY environment variable is not set');
  process.exit(1);
}

async function testPaystackConnection() {
  console.log('Testing Paystack API connection...');
  
  try {
    // Test fetching transactions
    const response = await fetch('https://api.paystack.co/transaction?perPage=5', {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('Success! API responded with:', {
      status: data.status,
      message: data.message,
      transactionCount: data.data?.length || 0
    });
    
    if (data.data && data.data.length > 0) {
      console.log('First transaction sample:', {
        reference: data.data[0].reference,
        amount: data.data[0].amount,
        status: data.data[0].status,
        customer: data.data[0].customer?.email,
        subaccount: data.data[0].subaccount?.subaccount_code
      });
    }
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testPaystackConnection().then(() => {
  console.log('Test completed');
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});