import Sermon from '../models/Sermon.js'
import { uploadsDir } from '../config/multer.js'

class SermonController {
  /**
   * Get all sermons
   */
  async getAllSermons(req, res) {
    try {
      const sermons = Sermon.getAll()
      res.json(sermons)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sermons' })
    }
  }

  /**
   * Get sermon by ID
   */
  async getSermonById(req, res) {
    try {
      const sermon = Sermon.getById(req.params.id)
      if (!sermon) {
        return res.status(404).json({ error: 'Sermon not found' })
      }
      res.json(sermon)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sermon' })
    }
  }

  /**
   * Create new sermon
   */
  async createSermon(req, res) {
    try {
      const { title, date, description } = req.body
      
      if (!title || !date) {
        return res.status(400).json({ error: 'Title and date are required' })
      }

      if (!req.files || !req.files.audioFile) {
        return res.status(400).json({ error: 'Audio file is required' })
      }

      const sermonData = {
        title,
        date,
        description,
        audioFile: req.files.audioFile[0].filename,
        imageFile: req.files.imageFile ? req.files.imageFile[0].filename : null
      }

      const sermon = Sermon.create(sermonData)
      res.status(201).json(sermon)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sermon' })
    }
  }

  /**
   * Update sermon order
   */
  async reorderSermons(req, res) {
    try {
      const { sermonIds } = req.body
      
      Sermon.reorder(sermonIds)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to reorder sermons' })
    }
  }

  /**
   * Delete sermon
   */
  async deleteSermon(req, res) {
    try {
      const deletedSermon = Sermon.delete(req.params.id, uploadsDir)
      
      if (!deletedSermon) {
        return res.status(404).json({ error: 'Sermon not found' })
      }

      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete sermon' })
    }
  }
}

export default new SermonController()