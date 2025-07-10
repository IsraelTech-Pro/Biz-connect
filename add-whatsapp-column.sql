-- Add WhatsApp column to users table
ALTER TABLE users ADD COLUMN whatsapp character varying;

-- Update existing records with null values for whatsapp
UPDATE users SET whatsapp = NULL WHERE whatsapp IS NULL;