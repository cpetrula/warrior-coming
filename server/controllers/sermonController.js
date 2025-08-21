import { sermonModel } from '../models/sermonModel.js'
import { uploadsDir } from '../middleware/upload.js'
import path from 'path'
import fs from 'fs'

export const sermonController = {
  // Get all sermons
  getAllSermons(req, res) {
    res.json(sermonModel.getAll())
  },

  // Get sermon by ID
  getSermonById(req, res) {
    const sermon = sermonModel.getById(req.params.id)
    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' })
    }
    res.json(sermon)
  },

  // Create new sermon
  createSermon(req, res) {
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
        description: description || '',
        audioFile: req.files.audioFile[0].filename,
        imageFile: req.files.imageFile ? req.files.imageFile[0].filename : null
      }

      const sermon = sermonModel.create(sermonData)
      res.status(201).json(sermon)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sermon' })
    }
  },

  // Update sermon order
  updateSermonOrder(req, res) {
    try {
      const { sermonIds } = req.body
      sermonModel.updateOrder(sermonIds)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to reorder sermons' })
    }
  },

  // Delete sermon
  deleteSermon(req, res) {
    try {
      const sermon = sermonModel.delete(req.params.id)
      if (!sermon) {
        return res.status(404).json({ error: 'Sermon not found' })
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

      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete sermon' })
    }
  }
}