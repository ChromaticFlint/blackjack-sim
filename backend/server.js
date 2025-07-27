import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 10000

// Middleware
app.use(cors())
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'blackjack-backend'
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎲 Blackjack server running on port ${PORT}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`)
})
