-- Add WhatsApp column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

-- Create index for WhatsApp column
CREATE INDEX IF NOT EXISTS idx_users_whatsapp ON users(whatsapp);

-- Update existing users to have WhatsApp numbers based on their phone numbers
UPDATE users 
SET whatsapp = phone 
WHERE whatsapp IS NULL AND phone IS NOT NULL;

COMMIT;