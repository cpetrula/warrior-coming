import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import sermonRoutes from './routes/sermons.js'
import blogRoutes from './routes/blogs.js'
import musicRoutes from './routes/music.js'
import { uploadsDir } from './config/multer.js'
import { testConnection, closePool } from './config/database.js'


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
app.use('/api/blogs', blogRoutes)
app.use('/api/music', musicRoutes)

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend/dist', 'index.html'))
})

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  
  // Test database connection
  const dbConnected = await testConnection()
  if (!dbConnected) {
    console.warn('Warning: Database connection failed. Some features may not work properly.')
  }

})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Shutting down gracefully...')
  await closePool()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Shutting down gracefully...')
  await closePool()
  process.exit(0)
})