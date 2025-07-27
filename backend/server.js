import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

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

// Socket.io for multiplayer (future feature)
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id)
  
  socket.on('join-room', (roomCode) => {
    socket.join(roomCode)
    console.log(`Player ${socket.id} joined room ${roomCode}`)
  })
  
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`🎲 Blackjack server running on port ${PORT}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
})
