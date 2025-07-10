-- Migration to change profile_picture and banner_url from text to JSONB
-- This allows storing image metadata along with URLs

-- Change profile_picture to JSONB
ALTER TABLE users ALTER COLUMN profile_picture TYPE JSONB USING 
  CASE 
    WHEN profile_picture IS NULL THEN NULL
    WHEN profile_picture = '' THEN NULL
    ELSE jsonb_build_object('url', profile_picture, 'alt', 'Profile picture', 'primary', true)
  END;

-- Change banner_url to JSONB  
ALTER TABLE users ALTER COLUMN banner_url TYPE JSONB USING 
  CASE 
    WHEN banner_url IS NULL THEN NULL
    WHEN banner_url = '' THEN NULL
    ELSE jsonb_build_object('url', banner_url, 'alt', 'Store banner', 'primary', true)
  END;

-- Add indexes for better performance on JSONB fields
CREATE INDEX IF NOT EXISTS idx_users_profile_picture_url ON users USING gin ((profile_picture->>'url'));
CREATE INDEX IF NOT EXISTS idx_users_banner_url ON users USING gin ((banner_url->>'url'));

-- Update any existing records that might have empty strings
UPDATE users SET profile_picture = NULL WHERE profile_picture = 'null'::jsonb OR profile_picture = '""'::jsonb;
UPDATE users SET banner_url = NULL WHERE banner_url = 'null'::jsonb OR banner_url = '""'::jsonb;