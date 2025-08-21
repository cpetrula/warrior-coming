import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import sermonRoutes from './routes/sermonRoutes.js'
import { uploadsDir } from './middleware/upload.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function createApp() {
  const app = express()

  // Middleware
  app.use(cors())
  app.use(express.json())
  app.use(express.static('frontend/dist'))

  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir))

  // API Routes
  app.use('/api/sermons', sermonRoutes)

  // Fallback to index.html for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
  })

  return app
}