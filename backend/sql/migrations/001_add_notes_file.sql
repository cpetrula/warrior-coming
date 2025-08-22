-- Migration: Add notes_file column to sermons table
-- Date: 2024

USE warriorc_db;

-- Add notes_file column if it doesn't exist
ALTER TABLE sermons 
ADD COLUMN IF NOT EXISTS notes_file VARCHAR(255) DEFAULT NULL;