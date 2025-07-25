-- Add tags column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Update existing articles to have empty tags array if null
UPDATE articles SET tags = '{}' WHERE tags IS NULL;