-- Temporarily remove foreign key constraint from payments table to allow testing
-- This allows payments to be created without requiring valid order_id references

-- Drop the foreign key constraint for order_id in payments table
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_order_id_fkey;

-- Verify the constraint was removed
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE n.nspname = 'public' AND conrelid = 'payments'::regclass;

-- The foreign key constraint should now be removed, allowing payments to be created with any order_id value