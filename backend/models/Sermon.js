import fs from 'fs'
import path from 'path'

class Sermon {
  constructor() {
    // In-memory storage for sermons (in production, use a proper database)
    this.sermons = []
    this.nextId = 1
  }

  /**
   * Get all sermons sorted by order
   */
  getAll() {
    return this.sermons.sort((a, b) => a.order - b.order)
  }

  /**
   * Get sermon by ID
   */
  getById(id) {
    return this.sermons.find(s => s.id === id)
  }

  /**
   * Create a new sermon
   */
  create({ title, date, description, audioFile, imageFile }) {
    const sermon = {
      id: String(this.nextId++),
      title,
      date,
      description: description || '',
      audioFile,
      imageFile: imageFile || null,
      order: this.sermons.length,
      createdAt: new Date().toISOString()
    }

    this.sermons.push(sermon)
    return sermon
  }

  /**
   * Update sermon order based on array of IDs
   */
  reorder(sermonIds) {
    sermonIds.forEach((id, index) => {
      const sermon = this.sermons.find(s => s.id === id)
      if (sermon) {
        sermon.order = index
      }
    })
    return true
  }

  /**
   * Update an existing sermon
   */
  update(id, updateData, uploadsDir) {
    const sermon = this.sermons.find(s => s.id === id)
    if (!sermon) {
      return null
    }

    // Handle file cleanup if new files are uploaded
    if (updateData.audioFile && sermon.audioFile !== updateData.audioFile) {
      const oldAudioPath = path.join(uploadsDir, sermon.audioFile)
      if (fs.existsSync(oldAudioPath)) {
        fs.unlinkSync(oldAudioPath)
      }
    }

    if (updateData.imageFile && sermon.imageFile !== updateData.imageFile) {
      const oldImagePath = path.join(uploadsDir, sermon.imageFile)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }

    // Update sermon properties
    if (updateData.title !== undefined) sermon.title = updateData.title
    if (updateData.date !== undefined) sermon.date = updateData.date
    if (updateData.description !== undefined) sermon.description = updateData.description
    if (updateData.audioFile !== undefined) sermon.audioFile = updateData.audioFile
    if (updateData.imageFile !== undefined) sermon.imageFile = updateData.imageFile

    return sermon
  }

  /**
   * Delete sermon by ID and remove associated files
   */
  delete(id, uploadsDir) {
    const sermonIndex = this.sermons.findIndex(s => s.id === id)
    if (sermonIndex === -1) {
      return null
    }

    const sermon = this.sermons[sermonIndex]
    
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

    this.sermons.splice(sermonIndex, 1)
    return sermon
  }
}

// Create and export a singleton instance
export default new Sermon()