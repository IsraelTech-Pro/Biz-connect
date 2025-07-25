// Create a test user with proper password hash for testing sync
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  console.log('Creating test user...');
  
  try {
    // Hash the password properly
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create vendor user
    const vendorData = {
      email: 'israelopoku360@gmail.com',
      password: hashedPassword,
      full_name: 'Test Vendor User',
      role: 'vendor',
      business_name: 'Test Vendor Store',
      business_description: 'Test vendor for sync testing',
      phone: '+233551035300',
      whatsapp: '+233551035300',
      paystack_subaccount: 'ACCT_9ps6vd9cj34mi7p',
      is_approved: true
    };
    
    // First, check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', vendorData.email)
      .single();
    
    if (existingUser) {
      console.log('User already exists:', existingUser);
      
      // Update the user to ensure proper fields
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          paystack_subaccount: vendorData.paystack_subaccount,
          whatsapp: vendorData.whatsapp,
          is_approved: true,
          role: 'vendor'
        })
        .eq('id', existingUser.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating user:', updateError);
      } else {
        console.log('Updated user:', updatedUser);
      }
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert(vendorData)
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user:', createError);
      } else {
        console.log('Created user:', newUser);
      }
    }
    
    // Also create a buyer user
    const buyerData = {
      email: 'testbuyer@example.com',
      password: hashedPassword,
      full_name: 'Test Buyer User',
      role: 'buyer',
      phone: '+233241234567',
      whatsapp: '+233241234567'
    };
    
    const { data: existingBuyer } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', buyerData.email)
      .single();
    
    if (!existingBuyer) {
      const { data: newBuyer, error: buyerError } = await supabase
        .from('users')
        .insert(buyerData)
        .select()
        .single();
      
      if (buyerError) {
        console.error('Error creating buyer:', buyerError);
      } else {
        console.log('Created buyer:', newBuyer);
      }
    }
    
    console.log('Test user setup completed');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser().then(() => {
  console.log('Setup completed');
  process.exit(0);
}).catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});