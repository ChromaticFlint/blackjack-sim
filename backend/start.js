#!/usr/bin/env node

// Simple start script for Render deployment
console.log('🚀 Starting Blackjack Backend via start.js...')

// Import and run the main server
import('./server.js')
  .then(() => {
    console.log('✅ Server imported successfully')
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  })
