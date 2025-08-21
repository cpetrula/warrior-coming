import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Sermon {
  constructor() {
    // Initialize database connection
    this.initializeDatabase()
  }

  async initializeDatabase() {
    try {
      // Read and execute schema SQL
      const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql')
      const schemaSql = fs.readFileSync(schemaPath, 'utf8')
      
      // Split by semicolon and execute each statement
      const statements = schemaSql.split(';').filter(stmt => stmt.trim())
      for (const statement of statements) {
        if (statement.trim()) {
          await pool.execute(statement)
        }
      }
      console.log('Database schema initialized successfully')
    } catch (error) {
      console.error('Failed to initialize database:', error.message)
    }
  }

  /**
   * Get all sermons sorted by order
   */
  async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, title, date, description, audio_file as audioFile, image_file as imageFile, sermon_order as `order`, created_at as createdAt FROM sermons ORDER BY sermon_order ASC'
      )
      return rows.map(row => ({
        ...row,
        id: String(row.id), // Convert to string for compatibility
        date: row.date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
      }))
    } catch (error) {
      console.error('Error fetching sermons:', error)
      throw error
    }
  }

  /**
   * Get sermon by ID
   */
  async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, title, date, description, audio_file as audioFile, image_file as imageFile, sermon_order as `order`, created_at as createdAt FROM sermons WHERE id = ?',
        [id]
      )
      if (rows.length === 0) return null
      
      const row = rows[0]
      return {
        ...row,
        id: String(row.id), // Convert to string for compatibility
        date: row.date.toISOString().split('T')[0] // Format date as YYYY-MM-DD
      }
    } catch (error) {
      console.error('Error fetching sermon by ID:', error)
      throw error
    }
  }

  /**
   * Create a new sermon
   */
  async create({ title, date, description, audioFile, imageFile }) {
    try {
      // Get the next order number
      const [maxOrderResult] = await pool.execute(
        'SELECT COALESCE(MAX(sermon_order), -1) + 1 as nextOrder FROM sermons'
      )
      const nextOrder = maxOrderResult[0].nextOrder

      const [result] = await pool.execute(
        'INSERT INTO sermons (title, date, description, audio_file, image_file, sermon_order) VALUES (?, ?, ?, ?, ?, ?)',
        [title, date, description || '', audioFile, imageFile || null, nextOrder]
      )

      // Return the created sermon
      return await this.getById(result.insertId)
    } catch (error) {
      console.error('Error creating sermon:', error)
      throw error
    }
  }

  /**
   * Update sermon order based on array of IDs
   */
  async reorder(sermonIds) {
    try {
      // Update each sermon's order in the database
      for (let i = 0; i < sermonIds.length; i++) {
        await pool.execute(
          'UPDATE sermons SET sermon_order = ? WHERE id = ?',
          [i, sermonIds[i]]
        )
      }
      return true
    } catch (error) {
      console.error('Error reordering sermons:', error)
      throw error
    }
  }

  /**
   * Update an existing sermon
   */
  async update(id, updateData, uploadsDir) {
    try {
      // First get the current sermon to handle file cleanup
      const currentSermon = await this.getById(id)
      if (!currentSermon) {
        return null
      }

      // Handle file cleanup if new files are uploaded
      if (updateData.audioFile && currentSermon.audioFile !== updateData.audioFile) {
        const oldAudioPath = path.join(uploadsDir, currentSermon.audioFile)
        if (fs.existsSync(oldAudioPath)) {
          fs.unlinkSync(oldAudioPath)
        }
      }

      if (updateData.imageFile && currentSermon.imageFile !== updateData.imageFile) {
        const oldImagePath = path.join(uploadsDir, currentSermon.imageFile)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }

      // Build update query dynamically based on provided fields
      const updates = []
      const values = []

      if (updateData.title !== undefined) {
        updates.push('title = ?')
        values.push(updateData.title)
      }
      if (updateData.date !== undefined) {
        updates.push('date = ?')
        values.push(updateData.date)
      }
      if (updateData.description !== undefined) {
        updates.push('description = ?')
        values.push(updateData.description)
      }
      if (updateData.audioFile !== undefined) {
        updates.push('audio_file = ?')
        values.push(updateData.audioFile)
      }
      if (updateData.imageFile !== undefined) {
        updates.push('image_file = ?')
        values.push(updateData.imageFile)
      }

      if (updates.length > 0) {
        values.push(id) // Add ID for WHERE clause
        await pool.execute(
          `UPDATE sermons SET ${updates.join(', ')} WHERE id = ?`,
          values
        )
      }

      // Return the updated sermon
      return await this.getById(id)
    } catch (error) {
      console.error('Error updating sermon:', error)
      throw error
    }
  }

  /**
   * Delete sermon by ID and remove associated files
   */
  async delete(id, uploadsDir) {
    try {
      // First get the sermon to access file information
      const sermon = await this.getById(id)
      if (!sermon) {
        return null
      }

      // Delete files
      if (sermon.audioFile) {
        const audioPath = path.join(uploadsDir, sermon.audioFile)
        if (fs.existsSync(audioPath)) {
          fs.unlinkSync(audioPath)
        }
      }
      
      if (sermon.imageFile) {
        const imagePath = path.join(uploadsDir, sermon.imageFile)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }

      // Delete from database
      await pool.execute('DELETE FROM sermons WHERE id = ?', [id])
      
      return sermon
    } catch (error) {
      console.error('Error deleting sermon:', error)
      throw error
    }
  }
}

// Create and export a singleton instance
export default new Sermon()