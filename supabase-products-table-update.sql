-- Add new columns to existing products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS brand character varying(100),
ADD COLUMN IF NOT EXISTS sku character varying(100),
ADD COLUMN IF NOT EXISTS weight numeric(10, 2),
ADD COLUMN IF NOT EXISTS dimensions character varying(100),
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);

-- Enable Row Level Security (if not already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Vendors can insert own products" ON public.products;
DROP POLICY IF EXISTS "Vendors can update own products" ON public.products;
DROP POLICY IF EXISTS "Vendors can delete own products" ON public.products;

-- Create RLS policies for products table
CREATE POLICY "Public can view products" ON public.products
FOR SELECT USING (true);

CREATE POLICY "Vendors can insert own products" ON public.products
FOR INSERT WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update own products" ON public.products
FOR UPDATE USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can delete own products" ON public.products
FOR DELETE USING (vendor_id = auth.uid());