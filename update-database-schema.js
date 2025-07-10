import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.DATABASE_URL.split('@')[1].split('/')[0];
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(`https://${supabaseUrl}`, supabaseKey);

async function updateDatabaseSchema() {
  try {
    console.log('Adding product_id column to payments table...');
    
    // Add product_id column to payments table
    const { error: paymentsError } = await supabase.rpc('sql', {
      query: `
        ALTER TABLE public.payments 
        ADD COLUMN IF NOT EXISTS product_id uuid NULL;
        
        ALTER TABLE public.payments 
        ADD CONSTRAINT IF NOT EXISTS fk_payments_product_id 
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;
        
        CREATE INDEX IF NOT EXISTS idx_payments_product_id 
        ON public.payments USING btree (product_id);
      `
    });

    if (paymentsError) {
      console.error('Error updating payments table:', paymentsError);
    } else {
      console.log('✓ Payments table updated successfully');
    }

    console.log('Adding product_id column to payouts table...');
    
    // Add product_id column to payouts table
    const { error: payoutsError } = await supabase.rpc('sql', {
      query: `
        ALTER TABLE public.payouts 
        ADD COLUMN IF NOT EXISTS product_id uuid NULL;
        
        ALTER TABLE public.payouts 
        ADD CONSTRAINT IF NOT EXISTS fk_payouts_product_id 
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;
        
        CREATE INDEX IF NOT EXISTS idx_payouts_product_id 
        ON public.payouts USING btree (product_id);
      `
    });

    if (payoutsError) {
      console.error('Error updating payouts table:', payoutsError);
    } else {
      console.log('✓ Payouts table updated successfully');
    }

    console.log('Updating existing payment record...');
    
    // Update existing payment record with product_id
    const { error: updateError } = await supabase
      .from('payments')
      .update({ product_id: '1838f031-2cf6-42ae-a57a-a3bba6aeb04b' })
      .eq('reference', 'VH_1752117543289_sfa6ows83');

    if (updateError) {
      console.error('Error updating payment record:', updateError);
    } else {
      console.log('✓ Payment record updated with product_id');
    }

    console.log('Verifying updates...');
    
    // Verify the updates
    const { data: payment, error: verifyError } = await supabase
      .from('payments')
      .select(`
        id, reference, amount, vendor_id, buyer_id, product_id,
        products (title, price, category),
        users!payments_buyer_id_fkey (name, email),
        orders (shipping_address, phone, notes)
      `)
      .eq('reference', 'VH_1752117543289_sfa6ows83')
      .single();

    if (verifyError) {
      console.error('Error verifying updates:', verifyError);
    } else {
      console.log('✓ Payment data with joins:', JSON.stringify(payment, null, 2));
    }

  } catch (error) {
    console.error('Database schema update failed:', error);
  }
}

updateDatabaseSchema();