import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

import authRouter from './routes/auth'
import projectsRouter from './routes/projects'
import configRouter from './routes/config'
import uploadRouter from './routes/upload'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

// Serve uploaded files (persistent volume in production)
const uploadsDir = process.env.NODE_ENV === 'production'
  ? '/data/uploads'
  : path.join(__dirname, '../uploads')
app.use('/uploads', express.static(uploadsDir))

// API routes
app.use('/api/auth', authRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/config', configRouter)
app.use('/api/upload', uploadRouter)

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
