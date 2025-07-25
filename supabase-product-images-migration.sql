-- Migration: Replace images column with product_images JSONB column
-- This provides better structure for multiple images with metadata

-- Add the new product_images column
ALTER TABLE products 
ADD COLUMN product_images jsonb DEFAULT '[]'::jsonb;

-- Migrate existing images data to product_images format
UPDATE products 
SET product_images = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'url', value::text,
      'alt', 'Product image',
      'primary', (ordinality = 1)
    )
  )
  FROM unnest(images) WITH ORDINALITY AS t(value, ordinality)
)
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- Drop the old images column
ALTER TABLE products DROP COLUMN images;

-- Create index for better performance on product_images queries
CREATE INDEX IF NOT EXISTS idx_products_product_images ON products USING gin(product_images);

-- Example of how product_images will be stored:
-- product_images: [
--   {
--     "url": "/uploads/image1.jpg",
--     "alt": "Product main image",
--     "primary": true
--   },
--   {
--     "url": "/uploads/image2.jpg", 
--     "alt": "Product side view",
--     "primary": false
--   }
-- ]