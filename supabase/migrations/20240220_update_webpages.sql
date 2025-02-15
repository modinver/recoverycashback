
-- Add new columns to webpages table if they don't exist
ALTER TABLE webpages
ADD COLUMN IF NOT EXISTS type boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS shcema_type text CHECK (shcema_type IN ('article', 'blogPosting', 'newsArticle', 'review', 'howTo'));
