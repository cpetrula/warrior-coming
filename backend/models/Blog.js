import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Blog {
  constructor() {
    // Initialize database connection
    this.initializeDatabase()
  }

  async initializeDatabase() {
    try {
      // Read and execute blogs table SQL
      const blogsTablePath = path.join(__dirname, '..', 'sql', 'add_blogs_table.sql')
      const blogsTableSql = fs.readFileSync(blogsTablePath, 'utf8')
      
      // Split by semicolon and execute each statement
      const statements = blogsTableSql.split(';').filter(stmt => stmt.trim())
      for (const statement of statements) {
        if (statement.trim()) {
          await pool.execute(statement)
        }
      }
      console.log('Blogs table initialized successfully')
    } catch (error) {
      console.error('Failed to initialize blogs table:', error.message)
    }
  }

  /**
   * Get all blogs sorted by date (newest first)
   */
  async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, title, date, content, blog_order as `order`, created_at as createdAt FROM blogs ORDER BY date DESC, created_at DESC'
      )
      
      return rows.map(row => ({
        ...row,
        id: String(row.id), // Convert to string for compatibility
        date: row.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      }))
    } catch (error) {
      console.error('Error getting all blogs:', error)
      throw error
    }
  }

  /**
   * Get blog by ID
   */
  async getById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, title, date, content, blog_order as `order`, created_at as createdAt FROM blogs WHERE id = ?',
        [id]
      )
      
      if (rows.length === 0) {
        return null
      }

      const blog = rows[0]
      return {
        ...blog,
        id: String(blog.id),
        date: blog.date.toISOString().split('T')[0],
      }
    } catch (error) {
      console.error('Error getting blog by ID:', error)
      throw error
    }
  }

  /**
   * Create a new blog
   */
  async create({ title, date, content }) {
    try {
      // Get the next order number
      const [maxOrderResult] = await pool.execute(
        'SELECT COALESCE(MAX(blog_order), -1) + 1 as nextOrder FROM blogs'
      )
      const nextOrder = maxOrderResult[0].nextOrder

      const [result] = await pool.execute(
        'INSERT INTO blogs (title, date, content, blog_order) VALUES (?, ?, ?, ?)',
        [title, date, content, nextOrder]
      )

      const blogId = result.insertId

      // Return the created blog
      return await this.getById(blogId)
    } catch (error) {
      console.error('Error creating blog:', error)
      throw error
    }
  }

  /**
   * Update blog order based on array of IDs
   */
  async reorder(blogIds) {
    try {
      const updatePromises = blogIds.map((id, index) => 
        pool.execute('UPDATE blogs SET blog_order = ? WHERE id = ?', [index, id])
      )
      await Promise.all(updatePromises)
      return true
    } catch (error) {
      console.error('Error reordering blogs:', error)
      throw error
    }
  }

  /**
   * Update an existing blog
   */
  async update(id, updateData) {
    try {
      // First get the current blog to verify it exists
      const currentBlog = await this.getById(id)
      if (!currentBlog) {
        return null
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
      if (updateData.content !== undefined) {
        updates.push('content = ?')
        values.push(updateData.content)
      }

      if (updates.length > 0) {
        values.push(id) // Add ID for WHERE clause
        await pool.execute(
          `UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`,
          values
        )
      }

      // Return the updated blog
      return await this.getById(id)
    } catch (error) {
      console.error('Error updating blog:', error)
      throw error
    }
  }

  /**
   * Delete blog by ID
   */
  async delete(id) {
    try {
      // First get the blog to return it
      const blog = await this.getById(id)
      if (!blog) {
        return null
      }

      // Delete from database
      await pool.execute('DELETE FROM blogs WHERE id = ?', [id])
      
      return blog
    } catch (error) {
      console.error('Error deleting blog:', error)
      throw error
    }
  }
}

export default new Blog()