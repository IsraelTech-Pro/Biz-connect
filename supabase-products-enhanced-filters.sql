-- Enhanced Products Table for Comprehensive Filtering
-- This script adds all necessary fields for VendorHub's advanced filtering system

-- Add new filtering fields to the products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_flash_sale boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_clearance boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_trending boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_new_this_week boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_top_selling boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_hot_deal boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_dont_miss boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS original_price numeric(10,2),
ADD COLUMN IF NOT EXISTS discount_percentage integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS flash_sale_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS rating_average numeric(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS rating_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS low_stock_threshold integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS is_featured_vendor boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS search_keywords text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create indexes for better query performance on filter fields
CREATE INDEX IF NOT EXISTS idx_products_is_flash_sale ON products (is_flash_sale);
CREATE INDEX IF NOT EXISTS idx_products_is_clearance ON products (is_clearance);
CREATE INDEX IF NOT EXISTS idx_products_is_trending ON products (is_trending);
CREATE INDEX IF NOT EXISTS idx_products_is_new_this_week ON products (is_new_this_week);
CREATE INDEX IF NOT EXISTS idx_products_is_top_selling ON products (is_top_selling);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_hot_deal ON products (is_hot_deal);
CREATE INDEX IF NOT EXISTS idx_products_is_dont_miss ON products (is_dont_miss);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_rating_average ON products (rating_average);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products (updated_at);

-- Create composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_products_category_clearance ON products (category, is_clearance);
CREATE INDEX IF NOT EXISTS idx_products_category_flash_sale ON products (category, is_flash_sale);
CREATE INDEX IF NOT EXISTS idx_products_category_trending ON products (category, is_trending);
CREATE INDEX IF NOT EXISTS idx_products_price_range ON products (price, category);

-- Update existing products with sample filter data for testing
-- This will help populate the filters with realistic data

-- Set some products as flash sale items (20% of products)
UPDATE products 
SET is_flash_sale = true, 
    flash_sale_end_date = now() + interval '2 days',
    discount_percentage = 15 + (random() * 35)::int,
    original_price = price * (1 + (discount_percentage / 100.0))
WHERE random() < 0.2;

-- Set some products as clearance items (15% of products)
UPDATE products 
SET is_clearance = true,
    discount_percentage = 20 + (random() * 50)::int,
    original_price = price * (1 + (discount_percentage / 100.0))
WHERE random() < 0.15 AND NOT is_flash_sale;

-- Set some products as trending (25% of products)
UPDATE products 
SET is_trending = true
WHERE random() < 0.25;

-- Set some products as new this week (10% of products)
UPDATE products 
SET is_new_this_week = true
WHERE created_at >= now() - interval '7 days' OR random() < 0.1;

-- Set some products as top selling (20% of products)
UPDATE products 
SET is_top_selling = true,
    rating_average = 3.5 + (random() * 1.5),
    rating_count = 10 + (random() * 200)::int
WHERE random() < 0.2;

-- Set some products as featured (15% of products)
UPDATE products 
SET is_featured = true
WHERE random() < 0.15;

-- Set some products as hot deals (12% of products)
UPDATE products 
SET is_hot_deal = true,
    discount_percentage = 25 + (random() * 25)::int,
    original_price = price * (1 + (discount_percentage / 100.0))
WHERE random() < 0.12 AND NOT is_flash_sale AND NOT is_clearance;

-- Set some products as don't miss deals (10% of products)
UPDATE products 
SET is_dont_miss = true
WHERE random() < 0.1;

-- Update all products with rating data
UPDATE products 
SET rating_average = 2.5 + (random() * 2.5),
    rating_count = 5 + (random() * 150)::int
WHERE rating_average = 0.00;

-- Add search keywords based on title and category
UPDATE products 
SET search_keywords = string_to_array(
    lower(title || ' ' || category || ' ' || COALESCE(brand, '') || ' ' || COALESCE(description, '')), 
    ' '
)
WHERE search_keywords = '{}';

-- Update meta fields for SEO
UPDATE products 
SET meta_title = title || ' - VendorHub',
    meta_description = 'Buy ' || title || ' online at VendorHub. Best prices, fast delivery, authentic products.'
WHERE meta_title IS NULL;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to new columns for documentation
COMMENT ON COLUMN products.is_flash_sale IS 'Indicates if product is part of flash sale';
COMMENT ON COLUMN products.is_clearance IS 'Indicates if product is on clearance';
COMMENT ON COLUMN products.is_trending IS 'Indicates if product is trending';
COMMENT ON COLUMN products.is_new_this_week IS 'Indicates if product is new this week';
COMMENT ON COLUMN products.is_top_selling IS 'Indicates if product is top selling';
COMMENT ON COLUMN products.is_featured IS 'Indicates if product is featured';
COMMENT ON COLUMN products.is_hot_deal IS 'Indicates if product is a hot deal';
COMMENT ON COLUMN products.is_dont_miss IS 'Indicates if product is a dont miss deal';
COMMENT ON COLUMN products.original_price IS 'Original price before discount';
COMMENT ON COLUMN products.discount_percentage IS 'Discount percentage (0-100)';
COMMENT ON COLUMN products.flash_sale_end_date IS 'End date for flash sale';
COMMENT ON COLUMN products.rating_average IS 'Average rating (0.00-5.00)';
COMMENT ON COLUMN products.rating_count IS 'Number of ratings';
COMMENT ON COLUMN products.search_keywords IS 'Keywords for search optimization';
COMMENT ON COLUMN products.meta_title IS 'SEO meta title';
COMMENT ON COLUMN products.meta_description IS 'SEO meta description';