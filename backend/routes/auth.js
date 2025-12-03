import express from 'express'
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router()

// Authentication endpoint for admin
router.post('/admin', (req, res) => {
  const { password } = req.body
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (password === adminPassword) {
    res.json({ success: true, message: 'Authentication successful' })
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' })
  }
})

export default router