// Script to create default admin user
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.DATABASE_URL ? 
  `https://${process.env.DATABASE_URL.split('@')[1].split('/')[0]}` : 
  process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log('Creating admin_users table...');
    
    // Create admin_users table
    const { error: tableError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (tableError) {
      console.error('Error creating admin_users table:', tableError);
      return;
    }

    console.log('Admin users table created successfully');

    // Check if default admin exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', 'admin')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing admin:', checkError);
      return;
    }

    if (existingAdmin) {
      console.log('Default admin user already exists');
      console.log('Username: admin');
      console.log('Password: admin123');
      return;
    }

    // Create default admin user
    const { data: newAdmin, error: createError } = await supabase
      .from('admin_users')
      .insert([
        {
          username: 'admin',
          password: 'admin123', // Plain text as requested
          full_name: 'KTU BizConnect Administrator',
          email: 'admin@ktubizconnect.com',
          is_active: true
        }
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creating admin user:', createError);
      return;
    }

    console.log('✅ Default admin user created successfully!');
    console.log('');
    console.log('🔐 Admin Login Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('');
    console.log('📝 You can update the password directly in the database:');
    console.log('Table: admin_users');
    console.log('Field: password (stored as plain text)');
    console.log('');
    console.log('🌐 Access admin panel at: /admin/login');

  } catch (error) {
    console.error('Script error:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();