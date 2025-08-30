-- Add sermon_images table for multiple images per sermon
CREATE TABLE IF NOT EXISTS sermon_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sermon_id INT NOT NULL,
  image_file VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sermon_id) REFERENCES sermons(id) ON DELETE CASCADE,
  INDEX idx_sermon_id (sermon_id)
);