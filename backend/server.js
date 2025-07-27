import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 10000

console.log('🚀 Starting Blackjack Backend...')
console.log('📍 Port:', PORT)
console.log('🌍 Environment:', process.env.NODE_ENV || 'development')

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://*.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'blackjack-backend',
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Blackjack Backend API',
    status: 'running',
    endpoints: {
      health: '/health',
      stats: '/api/stats'
    }
  })
})

// Game stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    totalGames: 0,
    activeRooms: 0,
    playersOnline: 0
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎲 Blackjack server running on port ${PORT}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📡 Server ready to accept connections`)
})

// Handle server errors
server.on('error', (error) => {
  console.error('Server failed to start:', error)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
