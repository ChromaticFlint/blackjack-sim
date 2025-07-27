#!/bin/bash

echo "🚀 Starting Blackjack Backend Deployment..."

# Force npm usage
echo "📦 Installing dependencies with npm..."
npm install --production

echo "✅ Dependencies installed"
echo "🎲 Starting server..."

# Start the server
npm start
