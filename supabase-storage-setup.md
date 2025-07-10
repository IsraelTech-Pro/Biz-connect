# Supabase Storage Setup for VendorHub

## 1. Create Storage Bucket for Product Images

To enable image uploads, you need to create a storage bucket in Supabase:

### Step 1: Access Storage in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to "Storage" in the left sidebar
3. Click "Create a new bucket"

### Step 2: Create the Bucket
- **Bucket name**: `product-images`
- **Public bucket**: ✅ Enable (so images can be displayed publicly)
- **File size limit**: 10 MB (recommended for product images)
- **Allowed file types**: image/* (or specifically: image/jpeg, image/png, image/webp)

### Step 3: Set up Bucket Policies
After creating the bucket, you need to set up security policies:

1. Go to "Storage" → "Policies"
2. Create the following policies for the `product-images` bucket:

**Policy 1: Allow Public Read Access**
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

**Policy 2: Allow Authenticated Users to Upload**
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Allow Users to Update Their Own Images**
```sql
CREATE POLICY "Users can update own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 4: Allow Users to Delete Their Own Images**
```sql
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 2. Update Database Schema

### Products Table
The products table you provided needs to be created in Supabase. Here's the complete setup:

```sql
-- Create the products table
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  title character varying(255) NOT NULL,
  description text NULL,
  price numeric(10, 2) NOT NULL,
  category character varying(100) NOT NULL,
  image_url text NULL,
  images text[] NULL DEFAULT '{}', -- Array for multiple images
  stock_quantity integer NOT NULL DEFAULT 0,
  vendor_id uuid NOT NULL,
  brand character varying(100) NULL,
  sku character varying(100) NULL,
  weight numeric(10, 2) NULL,
  dimensions character varying(100) NULL,
  tags text[] NULL DEFAULT '{}',
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_created_at ON public.products(created_at);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Public can view products" ON public.products
FOR SELECT USING (true);

CREATE POLICY "Vendors can insert own products" ON public.products
FOR INSERT WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update own products" ON public.products
FOR UPDATE USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can delete own products" ON public.products
FOR DELETE USING (vendor_id = auth.uid());
```

## 3. Environment Variables

Make sure you have these environment variables set:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_database_url
```

## 4. Image Upload Implementation

The system is already set up to handle image uploads. When users upload images:

1. Images are uploaded to the `product-images` bucket
2. The system stores the Supabase storage URL in the database
3. Images are organized by user ID for better management
4. Multiple images per product are supported via the `images` array field

## 5. Testing the Setup

After completing the setup:

1. Try creating a product with images
2. Verify images are stored in the `product-images` bucket
3. Check that image URLs are properly saved in the database
4. Confirm images display correctly in the product listings

The authentication issue should now be resolved with the updated API calls that include the Bearer token.