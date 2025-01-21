-- Add featured_image column
ALTER TABLE webpages
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Fix typo in schema_type column name
ALTER TABLE webpages
RENAME COLUMN shcema_type TO schema_type;
