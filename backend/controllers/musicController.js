import Music from '../models/Music.js'
import { uploadsDir } from '../config/multer.js'

class MusicController {
  /**
   * Get all music items
   */
  async getAllMusic(req, res) {
    try {
      const music = await Music.getAll()
      res.json(music)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch music' })
    }
  }

  /**
   * Get music item by ID
   */
  async getMusicById(req, res) {
    try {
      const music = await Music.getById(req.params.id)
      if (!music) {
        return res.status(404).json({ error: 'Music not found' })
      }
      res.json(music)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch music' })
    }
  }

  /**
   * Create new music item
   */
  async createMusic(req, res) {
    try {
      const { title } = req.body
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' })
      }

      if (!req.files || !req.files.musicFile) {
        return res.status(400).json({ error: 'Music file is required' })
      }

      const musicData = {
        title,
        musicFile: req.files.musicFile[0].filename
      }

      const newMusic = await Music.create(musicData)
      res.status(201).json(newMusic)
    } catch (error) {
      console.error('Error creating music:', error)
      res.status(500).json({ error: 'Failed to create music' })
    }
  }

  /**
   * Update existing music item
   */
  async updateMusic(req, res) {
    try {
      const { title } = req.body
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' })
      }

      const updateData = { title }

      // Add new music file if provided
      if (req.files && req.files.musicFile) {
        updateData.musicFile = req.files.musicFile[0].filename
      }

      const updatedMusic = await Music.update(req.params.id, updateData, uploadsDir)
      
      if (!updatedMusic) {
        return res.status(404).json({ error: 'Music not found' })
      }

      res.json(updatedMusic)
    } catch (error) {
      console.error('Error updating music:', error)
      res.status(500).json({ error: 'Failed to update music' })
    }
  }

  /**
   * Update music order
   */
  async reorderMusic(req, res) {
    try {
      const { musicIds } = req.body
      
      await Music.reorder(musicIds)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to reorder music' })
    }
  }

  /**
   * Delete music item
   */
  async deleteMusic(req, res) {
    try {
      const deleted = await Music.delete(req.params.id, uploadsDir)
      
      if (!deleted) {
        return res.status(404).json({ error: 'Music not found' })
      }

      res.json({ success: true })
    } catch (error) {
      console.error('Error deleting music:', error)
      res.status(500).json({ error: 'Failed to delete music' })
    }
  }
}

// Export a single instance
export default new MusicController()