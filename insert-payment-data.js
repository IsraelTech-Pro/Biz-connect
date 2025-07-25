import express from 'express';
import { storage } from './server/storage.js';

async function insertPaymentData() {
  try {
    console.log('Inserting payment data...');
    
    // Insert the payment record
    const payment = await storage.createPayment({
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
      gateway_response: 'Approved',
      paid_at: new Date('2025-07-10T03:19:40Z'),
      created_at: new Date('2025-07-10T03:19:03Z'),
      updated_at: new Date('2025-07-10T03:19:40Z')
    });
    
    console.log('✅ Payment created:', payment);
    
    // Update the order with correct amount and buyer info
    const order = await storage.updateOrder('659ff927-ddf4-49b4-a9c9-0cc4653d68af', {
      total_amount: 0.20,
      phone: '233551035300',
      shipping_address: 'Accra, Ghana',
      notes: 'Test order for payment integration'
    });
    
    console.log('✅ Order updated:', order);
    
    // Verify the data
    const payments = await storage.getPaymentsByVendor('6fac5f0f-9522-49c2-a131-60bf330545d5');
    console.log('✅ Payments for vendor:', payments.length);
    
    const orders = await storage.getOrdersByVendor('6fac5f0f-9522-49c2-a131-60bf330545d5');
    console.log('✅ Orders for vendor:', orders.length);
    
    if (orders.length > 0) {
      console.log('Latest order:', {
        id: orders[0].id,
        total_amount: orders[0].total_amount,
        phone: orders[0].phone,
        shipping_address: orders[0].shipping_address
      });
    }
    
  } catch (error) {
    console.error('Failed to insert payment data:', error);
  }
}

insertPaymentData();