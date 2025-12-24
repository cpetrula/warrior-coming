-- Migration: Add seo_title and seo_description columns to sermons table
-- Date: 2024

USE warriorc_db;

-- Add seo_title column if it doesn't exist
ALTER TABLE sermons 
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255) DEFAULT NULL;

-- Add seo_description column if it doesn't exist
ALTER TABLE sermons 
ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT NULL;
