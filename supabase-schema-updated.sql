-- Drop existing tables if they exist
DROP TABLE IF EXISTS vendor_support_requests CASCADE;
DROP TABLE IF EXISTS support_requests CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP TABLE IF EXISTS payouts CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (matching Drizzle schema exactly)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer',
  store_name TEXT,
  store_description TEXT,
  store_logo TEXT,
  store_banner TEXT,
  momo_number TEXT,
  momo_verified BOOLEAN DEFAULT false,
  vendor_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  brand TEXT,
  sku TEXT,
  weight DECIMAL(10,2),
  dimensions TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id),
  vendor_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  amount DECIMAL(10,2) NOT NULL,
  payment_id TEXT,
  delivery_address TEXT,
  delivery_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payouts table
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  momo_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform settings table
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  min_payout_amount DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support requests table
CREATE TABLE support_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor support requests table
CREATE TABLE vendor_support_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_email TEXT NOT NULL,
  store_name TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_payouts_vendor_id ON payouts(vendor_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_support_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
-- Allow public user creation (for registration)
CREATE POLICY "Public can create users" ON users
  FOR INSERT TO public WITH CHECK (true);

-- Allow public read access to users (for vendor profiles)
CREATE POLICY "Public can view user profiles" ON users
  FOR SELECT TO public USING (true);

-- Allow public user updates
CREATE POLICY "Public can update user profiles" ON users
  FOR UPDATE TO public USING (true);

-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT TO public USING (true);

-- Allow public product creation
CREATE POLICY "Public can create products" ON products
  FOR INSERT TO public WITH CHECK (true);

-- Allow public product updates
CREATE POLICY "Public can update products" ON products
  FOR UPDATE TO public USING (true);

-- Allow public product deletion
CREATE POLICY "Public can delete products" ON products
  FOR DELETE TO public USING (true);

-- Allow public read access to orders
CREATE POLICY "Public can view orders" ON orders
  FOR SELECT TO public USING (true);

-- Allow public order creation
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT TO public WITH CHECK (true);

-- Allow public order updates
CREATE POLICY "Public can update orders" ON orders
  FOR UPDATE TO public USING (true);

-- Allow public access to payouts
CREATE POLICY "Public can view payouts" ON payouts
  FOR SELECT TO public USING (true);

CREATE POLICY "Public can create payouts" ON payouts
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Public can update payouts" ON payouts
  FOR UPDATE TO public USING (true);

-- Allow public access to platform settings
CREATE POLICY "Public can view platform settings" ON platform_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Public can update platform settings" ON platform_settings
  FOR UPDATE TO public USING (true);

-- Support requests are publicly creatable
CREATE POLICY "Support requests are publicly creatable" ON support_requests
  FOR INSERT TO public WITH CHECK (true);

-- Allow public read access to support requests
CREATE POLICY "Public can view support requests" ON support_requests
  FOR SELECT TO public USING (true);

-- Vendor support requests are publicly creatable
CREATE POLICY "Vendor support requests are publicly creatable" ON vendor_support_requests
  FOR INSERT TO public WITH CHECK (true);

-- Allow public read access to vendor support requests
CREATE POLICY "Public can view vendor support requests" ON vendor_support_requests
  FOR SELECT TO public USING (true);

-- Insert default platform settings
INSERT INTO platform_settings (commission_rate, min_payout_amount) VALUES (5.00, 50.00);