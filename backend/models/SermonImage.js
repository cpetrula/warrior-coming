import fs from 'fs'
import path from 'path'
import pool from '../config/database.js'

class SermonImage {
  /**
   * Get all images for a sermon
   */
  async getBySermonId(sermonId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, sermon_id as sermonId, image_file as imageFile, created_at as createdAt FROM sermon_images WHERE sermon_id = ? ORDER BY created_at ASC',
        [sermonId]
      )
      return rows.map(row => ({
        ...row,
        id: String(row.id),
        sermonId: String(row.sermonId)
      }))
    } catch (error) {
      console.error('Error fetching sermon images:', error)
      throw error
    }
  }

  /**
   * Add images to a sermon
   */
  async addImages(sermonId, imageFiles) {
    try {
      const insertedImages = []
      
      for (const imageFile of imageFiles) {
        const [result] = await pool.execute(
          'INSERT INTO sermon_images (sermon_id, image_file) VALUES (?, ?)',
          [sermonId, imageFile]
        )
        
        // Get the inserted image
        const [rows] = await pool.execute(
          'SELECT id, sermon_id as sermonId, image_file as imageFile, created_at as createdAt FROM sermon_images WHERE id = ?',
          [result.insertId]
        )
        
        if (rows.length > 0) {
          insertedImages.push({
            ...rows[0],
            id: String(rows[0].id),
            sermonId: String(rows[0].sermonId)
          })
        }
      }
      
      return insertedImages
    } catch (error) {
      console.error('Error adding sermon images:', error)
      throw error
    }
  }

  /**
   * Delete a specific image
   */
  async deleteImage(imageId, uploadsDir) {
    try {
      // First get the image info
      const [rows] = await pool.execute(
        'SELECT image_file as imageFile FROM sermon_images WHERE id = ?',
        [imageId]
      )
      
      if (rows.length === 0) {
        return null
      }
      
      const imageFile = rows[0].imageFile
      
      // Delete the physical file
      if (imageFile) {
        const imagePath = path.join(uploadsDir, imageFile)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }
      
      // Delete from database
      await pool.execute('DELETE FROM sermon_images WHERE id = ?', [imageId])
      
      return { id: imageId, imageFile }
    } catch (error) {
      console.error('Error deleting sermon image:', error)
      throw error
    }
  }

  /**
   * Delete all images for a sermon
   */
  async deleteAllBySermonId(sermonId, uploadsDir) {
    try {
      // Get all images for the sermon
      const images = await this.getBySermonId(sermonId)
      
      // Delete physical files
      for (const image of images) {
        if (image.imageFile) {
          const imagePath = path.join(uploadsDir, image.imageFile)
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
          }
        }
      }
      
      // Delete from database
      await pool.execute('DELETE FROM sermon_images WHERE sermon_id = ?', [sermonId])
      
      return images
    } catch (error) {
      console.error('Error deleting all sermon images:', error)
      throw error
    }
  }
}

export default new SermonImage()