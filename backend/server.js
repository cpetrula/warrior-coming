import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'frontend/dist')))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir))

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
})

// In-memory storage for sermons (in production, use a proper database)
let sermons = []
let nextId = 1

// API Routes

// Get all sermons
app.get('/api/sermons', (req, res) => {
  res.json(sermons.sort((a, b) => a.order - b.order))
})

// Get sermon by ID
app.get('/api/sermons/:id', (req, res) => {
  const sermon = sermons.find(s => s.id === req.params.id)
  if (!sermon) {
    return res.status(404).json({ error: 'Sermon not found' })
  }
  res.json(sermon)
})

// Create new sermon
app.post('/api/sermons', upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), (req, res) => {
  try {
    const { title, date, description } = req.body
    
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' })
    }

    if (!req.files || !req.files.audioFile) {
      return res.status(400).json({ error: 'Audio file is required' })
    }

    const sermon = {
      id: String(nextId++),
      title,
      date,
      description: description || '',
      audioFile: req.files.audioFile[0].filename,
      imageFile: req.files.imageFile ? req.files.imageFile[0].filename : null,
      order: sermons.length,
      createdAt: new Date().toISOString()
    }

    sermons.push(sermon)
    res.status(201).json(sermon)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sermon' })
  }
})

// Update sermon order
app.patch('/api/sermons/reorder', (req, res) => {
  try {
    const { sermonIds } = req.body
    
    sermonIds.forEach((id, index) => {
      const sermon = sermons.find(s => s.id === id)
      if (sermon) {
        sermon.order = index
      }
    })
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder sermons' })
  }
})

// Delete sermon
app.delete('/api/sermons/:id', (req, res) => {
  try {
    const sermonIndex = sermons.findIndex(s => s.id === req.params.id)
    if (sermonIndex === -1) {
      return res.status(404).json({ error: 'Sermon not found' })
    }

    const sermon = sermons[sermonIndex]
    
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

    sermons.splice(sermonIndex, 1)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sermon' })
  }
})

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend/dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})