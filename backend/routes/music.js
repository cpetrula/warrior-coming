import express from 'express'
import musicController from '../controllers/musicController.js'
import { upload } from '../config/multer.js'

const router = express.Router()

// Get all music items
router.get('/', musicController.getAllMusic)

// Get music item by ID
router.get('/:id', musicController.getMusicById)

// Create new music item (with file upload)
router.post('/', upload.fields([
  { name: 'musicFile', maxCount: 1 }
]), musicController.createMusic)

// Update existing music item (with optional file upload)
router.put('/:id', upload.fields([
  { name: 'musicFile', maxCount: 1 }
]), musicController.updateMusic)

// Update music order
router.patch('/reorder', musicController.reorderMusic)

// Delete music item
router.delete('/:id', musicController.deleteMusic)

export default router