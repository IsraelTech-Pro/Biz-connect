-- Add product_id foreign key to payments table
ALTER TABLE public.payments 
ADD COLUMN product_id uuid NULL;

-- Add foreign key constraint for product_id in payments table
ALTER TABLE public.payments 
ADD CONSTRAINT fk_payments_product_id 
FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;

-- Create index for product_id in payments table
CREATE INDEX IF NOT EXISTS idx_payments_product_id 
ON public.payments USING btree (product_id) TABLESPACE pg_default;

-- Add product_id foreign key to payouts table
ALTER TABLE public.payouts 
ADD COLUMN product_id uuid NULL;

-- Add foreign key constraint for product_id in payouts table
ALTER TABLE public.payouts 
ADD CONSTRAINT fk_payouts_product_id 
FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;

-- Create index for product_id in payouts table
CREATE INDEX IF NOT EXISTS idx_payouts_product_id 
ON public.payouts USING btree (product_id) TABLESPACE pg_default;

-- Update existing payment record with product_id
UPDATE public.payments 
SET product_id = '1838f031-2cf6-42ae-a57a-a3bba6aeb04b'
WHERE reference = 'VH_1752117543289_sfa6ows83';

-- Verify the update
SELECT p.id, p.reference, p.amount, p.vendor_id, p.buyer_id, p.product_id, pr.title as product_title
FROM payments p
LEFT JOIN products pr ON p.product_id = pr.id
WHERE p.reference = 'VH_1752117543289_sfa6ows83';