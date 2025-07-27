# 🚀 Blackjack Simulator Deployment Guide

## 📋 Prerequisites

- GitHub account
- Netlify account
- Railway/Render account (for backend)

## 🎯 Frontend Deployment (Netlify)

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repo
   - Build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`

### Option 2: Manual Deploy

1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `frontend/dist` folder

## 🔧 Backend Deployment (Railway)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy backend**:
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Set environment variables**:
   ```bash
   railway variables set FRONTEND_URL=https://your-netlify-url.netlify.app
   ```

## 🌐 Alternative Backend (Render)

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repo
4. Settings:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`

## ✅ Verification

After deployment:

1. **Frontend**: Visit your Netlify URL
2. **Backend**: Visit `your-backend-url/health`
3. **Test the game**: Play a few hands to verify everything works

## 🔗 URLs

- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-backend.railway.app` or `https://your-backend.onrender.com`

## 🎮 Features Deployed

✅ Single-player blackjack with perfect mathematical logic
✅ Bankroll tracking with localStorage persistence  
✅ Session statistics (wins, losses, profit/loss)
✅ Proper payouts (3:2 blackjack, 1:1 regular wins)
✅ Mobile-responsive design
✅ Real-time game state management

## 🚧 Future Features (Backend Ready)

- Multiplayer rooms
- Real-time chat
- Leaderboards
- Tournament mode
