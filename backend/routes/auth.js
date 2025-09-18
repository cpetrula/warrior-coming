import express from 'express'

const router = express.Router()

// Authentication endpoint for admin
router.post('/admin', (req, res) => {
  const { password } = req.body
  const adminPassword = process.env.ADMIN_PASSWORD || 'Lakers2025!'
  
  if (password === adminPassword) {
    res.json({ success: true, message: 'Authentication successful' })
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' })
  }
})

export default router