-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

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

-- Alternative: If you want to allow vendors to manage any images in their folder
-- CREATE POLICY "Vendors can manage images in their folder" ON storage.objects
-- FOR ALL USING (
--   bucket_id = 'product-images' 
--   AND auth.uid()::text = (storage.foldername(name))[1]
-- );