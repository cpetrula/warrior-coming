import Sermon from '../models/Sermon.js'
import { uploadsDir } from '../config/multer.js'

class SermonController {
  /**
   * Get all sermons
   */
  async getAllSermons(req, res) {
    try {
      const sermons = await Sermon.getAll()
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
      const sermon = await Sermon.getById(req.params.id)
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
        imageFile: req.files.imageFile ? req.files.imageFile[0].filename : null,
        notesFile: req.files.notesFile ? req.files.notesFile[0].filename : null
      }

      // Handle multiple images if provided
      if (req.files.imageFiles) {
        sermonData.imageFiles = req.files.imageFiles.map(file => file.filename)
      }

      const sermon = await Sermon.create(sermonData)
      res.status(201).json(sermon)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sermon' })
    }
  }

  /**
   * Update existing sermon
   */
  async updateSermon(req, res) {
    try {
      const { id } = req.params
      const { title, date, description } = req.body
      
      if (!title || !date) {
        return res.status(400).json({ error: 'Title and date are required' })
      }

      const updateData = {
        title,
        date,
        description
      }

      // Handle file updates if provided
      if (req.files) {
        if (req.files.audioFile) {
          updateData.audioFile = req.files.audioFile[0].filename
        }
        if (req.files.imageFile) {
          updateData.imageFile = req.files.imageFile[0].filename
        }
        if (req.files.notesFile) {
          updateData.notesFile = req.files.notesFile[0].filename
        }
        
        // Handle multiple images if provided
        if (req.files.imageFiles) {
          const imageFiles = req.files.imageFiles.map(file => file.filename)
          await Sermon.addImages(id, imageFiles)
        }
      }

      const updatedSermon = await Sermon.update(id, updateData, uploadsDir)
      
      if (!updatedSermon) {
        return res.status(404).json({ error: 'Sermon not found' })
      }

      res.json(updatedSermon)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update sermon' })
    }
  }

  /**
   * Update sermon order
   */
  async reorderSermons(req, res) {
    try {
      const { sermonIds } = req.body
      
      await Sermon.reorder(sermonIds)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to reorder sermons' })
    }
  }

  /**
   * Delete sermon image
   */
  async deleteSermonImage(req, res) {
    try {
      const updatedSermon = await Sermon.deleteImage(req.params.id, uploadsDir)
      
      if (!updatedSermon) {
        return res.status(404).json({ error: 'Sermon not found' })
      }

      res.json(updatedSermon)
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete sermon image' })
    }
  }

  /**
   * Delete sermon
   */
  async deleteSermon(req, res) {
    try {
      const deletedSermon = await Sermon.delete(req.params.id, uploadsDir)
      
      if (!deletedSermon) {
        return res.status(404).json({ error: 'Sermon not found' })
      }

      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete sermon' })
    }
  }

  /**
   * Add images to sermon
   */
  async addSermonImages(req, res) {
    try {
      const { id } = req.params
      
      if (!req.files || !req.files.imageFiles) {
        return res.status(400).json({ error: 'No images provided' })
      }

      const imageFiles = req.files.imageFiles.map(file => file.filename)
      const addedImages = await Sermon.addImages(id, imageFiles)
      
      res.status(201).json(addedImages)
    } catch (error) {
      res.status(500).json({ error: 'Failed to add images to sermon' })
    }
  }

  /**
   * Get all images for a sermon
   */
  async getSermonImages(req, res) {
    try {
      const images = await Sermon.getSermonImages(req.params.id)
      res.json(images)
    } catch (error) {
      res.status(500).json({ error: 'Failed to get sermon images' })
    }
  }

  /**
   * Delete a specific sermon image
   */
  async deleteSpecificSermonImage(req, res) {
    try {
      const { imageId } = req.params
      const deletedImage = await Sermon.deleteSermonImage(imageId, uploadsDir)
      
      if (!deletedImage) {
        return res.status(404).json({ error: 'Image not found' })
      }

      res.json({ success: true, deletedImage })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete sermon image' })
    }
  }
}

export default new SermonController()