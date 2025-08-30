-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS warriorc_db;

-- Use the database
USE warriorc_db;

-- Create sermons table
CREATE TABLE IF NOT EXISTS sermons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  audio_file VARCHAR(255) NOT NULL,
  image_file VARCHAR(255),
  notes_file VARCHAR(255),
  sermon_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sermon_order (sermon_order),
  INDEX idx_date (date)
);

-- Create sermon_images table for multiple images per sermon
CREATE TABLE IF NOT EXISTS sermon_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sermon_id INT NOT NULL,
  image_file VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sermon_id) REFERENCES sermons(id) ON DELETE CASCADE,
  INDEX idx_sermon_id (sermon_id)
);