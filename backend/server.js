import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import sermonRoutes from './routes/sermons.js'
import { uploadsDir } from './config/multer.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'frontend/dist')))

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir))

// API Routes
app.use('/api/sermons', sermonRoutes)

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend/dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})