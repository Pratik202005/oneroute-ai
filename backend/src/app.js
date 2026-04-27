import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/index.js'

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))

// Health (root)
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'oneroute-ai-backend',
    time: new Date().toISOString(),
  })
})

// API routes
app.use('/api', apiRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  })
})

export default app