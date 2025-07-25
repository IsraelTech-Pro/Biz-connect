# Quick Supabase Setup for VendorHub

## Step 1: Update Products Table
Run this SQL in your Supabase SQL Editor:

```sql
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

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products table
CREATE POLICY "Public can view products" ON public.products
FOR SELECT USING (true);

CREATE POLICY "Vendors can insert own products" ON public.products
FOR INSERT WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update own products" ON public.products
FOR UPDATE USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can delete own products" ON public.products
FOR DELETE USING (vendor_id = auth.uid());
```

## Step 2: Create Storage Bucket
Run this SQL in your Supabase SQL Editor:

```sql
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Create RLS policies for storage bucket
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 3: Set Environment Variables
Make sure you have these in your Replit Secrets:

```
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Test the Setup
After running the SQL commands:

1. Try creating a product with images
2. Check that images are stored in the `product-images` bucket
3. Verify that the product data is saved with all fields

The authentication issue should be resolved and product creation should work properly with the multi-image upload functionality.