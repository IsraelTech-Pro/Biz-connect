-- Fix orders table to add missing amount column
-- This resolves the schema cache error for orders table

-- Add amount column to orders table if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Update existing orders to have proper amount values
UPDATE orders 
SET amount = 0.00 
WHERE amount IS NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_amount ON orders(amount);

-- Verify the column was added successfully
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'amount';