-- Migration: Add youtube_id column to sermons table
-- Date: 2025

USE warriorc_db;

-- Add youtube_id column if it doesn't exist
ALTER TABLE sermons 
ADD COLUMN IF NOT EXISTS youtube_id VARCHAR(255) DEFAULT NULL;
