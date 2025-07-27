# Blackjack Simulator

A modern, feature-rich blackjack simulation game with real-time odds calculation, perfect strategy recommendations, and both single-player and multiplayer modes.

## 🎯 Features

### 🎮 Game Modes
- **Single Player**: Play 1v1 against the dealer with full strategy assistance
- **Multiplayer**: Play with up to 4 friends (coming soon)
- **Real-time Odds**: See your probability of winning with every decision

### 📊 Strategy & Analytics
- **Perfect Basic Strategy**: Built-in recommendations for optimal play
- **Live Probability Calculations**: Real-time win/bust probabilities
- **Hand Analysis**: Detailed breakdown of your current situation
- **Statistical Tables**: Comprehensive blackjack statistics and house edge data

### 🎨 Modern Interface
- **Beautiful Card Animations**: Smooth, realistic card dealing and interactions
- **Casino-style Table**: Authentic green felt table with professional design
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes for extended play sessions

## 🛠️ Tech Stack

- **React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast development and building
- **React Router** for seamless navigation
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **Custom CSS** with modern gradients and responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd blackjack-sim
   ```

2. **Install dependencies:**
   ```bash
   npm run setup
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to http://localhost:5173

## 🎲 How to Play

### Single Player Mode
1. **Place Your Bet**: Choose your bet amount using the betting panel
2. **Receive Cards**: You and the dealer each get two cards
3. **Make Decisions**: Use the action buttons to Hit, Stand, Double Down, or Split
4. **Follow Strategy**: Check the odds panel for optimal play recommendations
5. **Win or Lose**: Beat the dealer without going over 21!

### Game Rules
- **Objective**: Get as close to 21 as possible without going over
- **Card Values**:
  - Number cards = Face value
  - Face cards (J, Q, K) = 10
  - Aces = 1 or 11 (whichever is better)
- **Blackjack**: Ace + 10-value card on first two cards (pays 3:2)
- **Dealer Rules**: Must hit on 16 or less, must stand on 17 or more

### Player Actions
- **Hit**: Take another card
- **Stand**: Keep your current total
- **Double Down**: Double your bet and take exactly one more card
- **Split**: Split pairs into two separate hands (coming soon)

## 📈 Strategy Features

### Real-time Odds Display
- **Hit Probability**: Chance of winning if you take another card
- **Stand Probability**: Chance of winning if you keep your current total
- **Bust Risk**: Probability of going over 21 on the next card
- **Dealer Bust**: Probability the dealer will bust

### Basic Strategy Recommendations
The app provides mathematically optimal play recommendations based on:
- Your hand total and composition (hard vs soft)
- Dealer's up card
- Available actions (double down, split opportunities)

## 🏗️ Project Structure

```
blackjack-sim/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Card.tsx        # Individual playing card
│   │   │   ├── GameTable.tsx   # Casino table layout
│   │   │   ├── PlayerHand.tsx  # Player's cards and info
│   │   │   ├── DealerHand.tsx  # Dealer's cards and info
│   │   │   ├── GameControls.tsx # Action buttons
│   │   │   ├── BettingPanel.tsx # Betting interface
│   │   │   └── OddsPanel.tsx   # Strategy and odds display
│   │   ├── pages/              # Main application pages
│   │   │   ├── HomePage.tsx    # Rules and statistics
│   │   │   ├── SinglePlayerPage.tsx # Main game interface
│   │   │   └── MultiPlayerPage.tsx  # Multiplayer lobby
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── game.ts         # Game state and data types
│   │   ├── utils/              # Game logic and utilities
│   │   │   └── gameEngine.ts   # Core blackjack game engine
│   │   ├── App.tsx             # Main app component with routing
│   │   └── App.css             # Comprehensive styling
│   └── package.json
├── package.json                # Root package configuration
└── README.md
```

## 🎨 Design Philosophy

### Visual Design
- **Casino Aesthetic**: Green felt table, realistic card designs, and casino-style UI
- **Modern Gradients**: Beautiful color transitions and depth effects
- **Smooth Animations**: Cards slide and flip naturally
- **Professional Typography**: Clear, readable fonts optimized for gaming

### User Experience
- **Intuitive Controls**: Large, clearly labeled action buttons
- **Immediate Feedback**: Real-time updates and visual confirmations
- **Educational**: Learn optimal strategy while playing
- **Accessible**: Works on all devices and screen sizes

## 🔮 Upcoming Features

### Multiplayer Mode
- **Real-time Gameplay**: WebSocket-based multiplayer sessions
- **Room System**: Create and join private games with friends
- **Chat Integration**: Communicate with other players
- **Leaderboards**: Track wins and losses across sessions

### Advanced Features
- **Card Counting Practice**: Learn and practice card counting techniques
- **Tournament Mode**: Compete in structured tournaments
- **Custom Rules**: Adjust house rules and betting limits
- **Statistics Tracking**: Detailed gameplay analytics and progress tracking

## 🧪 Testing

To run the application and test all features:

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Built with modern web technologies for optimal performance
- Implements mathematically accurate blackjack probabilities
- Designed with both casual players and strategy enthusiasts in mind
- Inspired by professional casino gaming experiences
