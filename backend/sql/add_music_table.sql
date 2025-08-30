-- Add music table to support music functionality
USE warriorc_db;

-- Create music table
CREATE TABLE IF NOT EXISTS music (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  music_file VARCHAR(255) NOT NULL,
  music_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_music_order (music_order),
  INDEX idx_created_at (created_at DESC)
);