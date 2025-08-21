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