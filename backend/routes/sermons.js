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
  { name: 'imageFile', maxCount: 1 },
  { name: 'notesFile', maxCount: 1 }
]), sermonController.createSermon)

// Update existing sermon
router.put('/:id', upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 },
  { name: 'notesFile', maxCount: 1 }
]), sermonController.updateSermon)

// Update sermon order
router.patch('/reorder', sermonController.reorderSermons)

// Delete sermon image
router.delete('/:id/image', sermonController.deleteSermonImage)

// Delete sermon
router.delete('/:id', sermonController.deleteSermon)

export default router