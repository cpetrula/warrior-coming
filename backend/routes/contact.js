import express from 'express'
import contactController from '../controllers/contactController.js'

const router = express.Router()

// Submit contact form
router.post('/', contactController.submitContactForm)

export default router
