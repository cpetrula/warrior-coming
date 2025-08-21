import express from 'express'
import sermonController from '../controllers/sermonController.js'
import { upload } from '../config/multer.js'

const router = express.Router()

// Get all sermons
router.get('/', sermonController.getAllSermons)

// Get sermon by ID
router.get('/:id', sermonController.getSermonById)

// Create new sermon
router.post('/', upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), sermonController.createSermon)

// Update sermon order
router.patch('/reorder', sermonController.reorderSermons)

// Delete sermon
router.delete('/:id', sermonController.deleteSermon)

export default router