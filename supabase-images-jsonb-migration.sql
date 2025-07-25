-- Migration: Update images field to JSONB format
-- This allows storing multiple images with metadata like URLs, alt text, etc.

-- First, let's update the existing images column to JSONB
ALTER TABLE products 
ALTER COLUMN images TYPE jsonb USING images::jsonb;

-- Set default value for images column
ALTER TABLE products 
ALTER COLUMN images SET DEFAULT '[]'::jsonb;

-- Create index for better performance on images queries
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING gin(images);

-- Update existing products to have proper JSONB format
UPDATE products 
SET images = '[]'::jsonb 
WHERE images IS NULL;

-- Example of how images will be stored:
-- images: [
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