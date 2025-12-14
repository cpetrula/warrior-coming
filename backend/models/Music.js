import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Music {
  constructor() {
    // Initialize database connection
    this.initializeDatabase()
  }

  async initializeDatabase() {
    try {
      // Read and execute music table SQL
      const musicTablePath = path.join(__dirname, '..', 'sql', 'add_music_table.sql')
      const musicTableSql = fs.readFileSync(musicTablePath, 'utf8')
      
      // Split by semicolon and execute each statement
      const statements = musicTableSql.split(';').filter(stmt => stmt.trim())
      for (const statement of statements) {
        if (statement.trim()) {
          await pool.execute(statement)
        }
      }
      console.log('Music table initialized successfully')
    } catch (error) {
      console.error('Failed to initialize music table:', error.message)
    }
  }

  /**
   * Get all music items sorted by date (newest first)
   */
  async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, title, music_file as musicFile, music_order as `order`, created_at as createdAt FROM music ORDER BY created_at DESC'
      )
      
      return rows.map(row => ({
        ...row,
        id: String(row.id), // Convert to string for compatibility
      }))
    } catch (error) {
      console.error('Error getting all music:', error)
      throw error
    }
  }

  /**
   * Get music item by ID
   */
  async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, title, music_file as musicFile, music_order as `order`, created_at as createdAt FROM music WHERE id = ?',
        [id]
      )
      
      if (rows.length === 0) {
        return null
      }
      
      return {
        ...rows[0],
        id: String(rows[0].id),
      }
    } catch (error) {
      console.error('Error getting music by ID:', error)
      throw error
    }
  }

  /**
   * Create new music item
   */
  async create(musicData) {
    try {
      const { title, musicFile } = musicData
      
      // Get the highest order number and add 1
      const [orderRows] = await pool.execute('SELECT COALESCE(MAX(music_order), 0) + 1 as nextOrder FROM music')
      const nextOrder = orderRows[0].nextOrder
      
      const [result] = await pool.execute(
        'INSERT INTO music (title, music_file, music_order) VALUES (?, ?, ?)',
        [title, musicFile, nextOrder]
      )
      
      return await this.getById(result.insertId)
    } catch (error) {
      console.error('Error creating music:', error)
      throw error
    }
  }

  /**
   * Update existing music item
   */
  async update(id, updateData, uploadsDir) {
    try {
      // First get the current music to handle file cleanup
      const currentMusic = await this.getById(id)
      if (!currentMusic) {
        return null
      }

      // Handle file cleanup if new music file is uploaded
      if (updateData.musicFile && currentMusic.musicFile !== updateData.musicFile && currentMusic.musicFile) {
        const oldMusicPath = path.join(uploadsDir, currentMusic.musicFile)
        if (fs.existsSync(oldMusicPath)) {
          fs.unlinkSync(oldMusicPath)
        }
      }

      // Build update query dynamically based on provided fields
      const updates = []
      const values = []

      if (updateData.title !== undefined) {
        updates.push('title = ?')
        values.push(updateData.title)
      }
      if (updateData.musicFile !== undefined) {
        updates.push('music_file = ?')
        values.push(updateData.musicFile)
      }

      if (updates.length > 0) {
        values.push(id) // Add ID for WHERE clause
        await pool.execute(
          `UPDATE music SET ${updates.join(', ')} WHERE id = ?`,
          values
        )
      }

      // Return the updated music
      return await this.getById(id)
    } catch (error) {
      console.error('Error updating music:', error)
      throw error
    }
  }

  /**
   * Reorder music items
   */
  async reorder(musicIds) {
    try {
      // Update order for each music item
      for (let i = 0; i < musicIds.length; i++) {
        await pool.execute(
          'UPDATE music SET music_order = ? WHERE id = ?',
          [i, musicIds[i]]
        )
      }
    } catch (error) {
      console.error('Error reordering music:', error)
      throw error
    }
  }

  /**
   * Delete music item and associated files
   */
  async delete(id, uploadsDir) {
    try {
      // Get the music item to delete associated files
      const music = await this.getById(id)
      if (!music) {
        return false
      }

      // Delete the music file if it exists
      if (music.musicFile) {
        const musicPath = path.join(uploadsDir, music.musicFile)
        if (fs.existsSync(musicPath)) {
          fs.unlinkSync(musicPath)
        }
      }

      // Delete from database
      const [result] = await pool.execute('DELETE FROM music WHERE id = ?', [id])
      
      return result.affectedRows > 0
    } catch (error) {
      console.error('Error deleting music:', error)
      throw error
    }
  }
}

// Export a single instance
export default new Music()