-- Add notes column to sermons table
USE warriorc_db;

-- Add the notes column if it doesn't exist
ALTER TABLE sermons ADD COLUMN IF NOT EXISTS notes LONGTEXT;
