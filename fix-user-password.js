// Fix the user password to ensure login works
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixUserPassword() {
  console.log('Fixing user password...');
  
  try {
    // Get current user
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('id, email, password')
      .eq('email', 'israelopoku360@gmail.com')
      .single();
    
    if (fetchError) {
      console.error('Error fetching user:', fetchError);
      return;
    }
    
    console.log('Current user:', currentUser);
    
    // Hash the password properly
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('New hashed password:', hashedPassword);
    
    // Update user with new password
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword
      })
      .eq('id', currentUser.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating password:', updateError);
    } else {
      console.log('Password updated successfully');
      
      // Test if the hash works
      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      console.log('Password validation test:', isValid);
    }
    
  } catch (error) {
    console.error('Error fixing password:', error);
  }
}

fixUserPassword().then(() => {
  console.log('Password fix completed');
  process.exit(0);
}).catch(error => {
  console.error('Password fix failed:', error);
  process.exit(1);
});