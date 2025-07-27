# Blackjack Simulator

A comprehensive, mathematically accurate blackjack simulation with advanced session tracking, auto-play functionality, and professional casino-style interface. Built with React and TypeScript for optimal performance and reliability.

## 🎯 Core Features

### 🎮 Game Modes
- **Single Player**: Complete 1v1 blackjack experience against AI dealer
- **Auto-Play Mode**: Automated betting and gameplay with customizable bet amounts
- **Session Management**: Persistent chip tracking and comprehensive statistics
- **Mobile Responsive**: Optimized layouts for desktop, tablet, and mobile devices

### 🎰 Blackjack Implementation
- **Standard Rules**: Classic blackjack with mathematically accurate gameplay
- **Proper Payouts**: 3:2 blackjack payouts, 1:1 regular wins, push handling
- **Dealer Logic**: Hits on 16 or less, stands on hard 17, hits on soft 17
- **Win Conditions**: Comprehensive bust detection and win determination
- **Blackjack Detection**: Accurate natural 21 identification and tracking

### 💰 Advanced Betting System
- **Flexible Betting**: $10-$500 bet range with quick bet buttons ($25, $50, $100, $250)
- **Chip Management**: Real-time chip tracking with localStorage persistence
- **Session Statistics**: Detailed tracking of hands played, wins, losses, pushes
- **Blackjack Counting**: Separate tracking of player and dealer natural blackjacks
- **Auto-Play Integration**: Remembers last bet amount for automated gameplay

### 📊 Session Analytics
- **Comprehensive Stats**: Hands played, win rate, net winnings, total wagered
- **Blackjack Tracking**: Player and dealer blackjack frequency analysis
- **Performance Metrics**: Real-time win rate calculation and profit/loss tracking
- **Session Reset**: Complete session reset with chip restoration to $1000
- **Data Persistence**: All statistics saved to localStorage for session continuity

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
1. **Start Session**: Begin with $1000 in chips (or continue from saved session)
2. **Place Your Bet**: Choose bet amount ($10-$500) using betting panel or quick bet buttons
3. **Receive Cards**: You and dealer each get two cards (dealer's second card hidden)
4. **Make Decisions**: Use action buttons to Hit, Stand, Double Down, or Split
5. **Dealer Plays**: Dealer reveals hidden card and plays according to house rules
6. **Win or Lose**: Beat the dealer without going over 21 to win chips!
7. **Track Progress**: Monitor session statistics in the left sidebar

### Complete Game Rules

#### Objective
Get a hand value as close to 21 as possible without exceeding it, while beating the dealer's hand.

#### Card Values
- **Number Cards (2-10)**: Face value
- **Face Cards (J, Q, K)**: Worth 10 points each
- **Aces**: Worth 1 or 11 points (automatically calculated for best value)

#### Hand Types
- **Hard Hand**: No aces, or aces counted as 1
- **Soft Hand**: Contains an ace counted as 11
- **Blackjack**: Ace + 10-value card as first two cards (pays 3:2)
- **Bust**: Hand value exceeds 21 (automatic loss)

#### Dealer Rules (Standard Casino Rules)
- **Must hit** on 16 or less
- **Must hit** on soft 17 (Ace + 6)
- **Must stand** on hard 17 or higher
- **Must stand** on 18 or higher

#### Player Actions
- **Hit**: Take another card (can repeat until bust or stand)
- **Stand**: Keep current hand total and end turn
- **Double Down**: Double bet, take exactly one more card, then stand
- **Split**: Split matching pairs into two separate hands (requires additional bet)

#### Win Conditions & Payouts
- **Player Blackjack vs Non-Blackjack**: Player wins 3:2 (bet + 1.5x bet)
- **Player Wins (non-blackjack)**: Player wins 1:1 (bet + bet)
- **Push (Tie)**: Bet returned, no win or loss
- **Player Busts**: Dealer wins regardless of dealer's hand
- **Dealer Busts**: Player wins if not busted
- **Both Blackjack**: Push (tie)

## 🎮 Interface Features

### Dual Sidebar Layout
- **Left Sidebar**: Game controls, session statistics, auto-play settings, strategy tips
- **Right Sidebar**: Betting panel, chip management, quick bet buttons
- **Mobile Layout**: Vertical stacking for optimal mobile experience
- **Responsive Design**: Adapts seamlessly to all screen sizes

### Game Controls Panel (Left Sidebar)
- **Auto-Play Controls**: Enable/disable automated gameplay with last bet amount
- **Session Statistics**: Real-time tracking of all game metrics
- **Reset Session**: Complete session reset with chip restoration
- **Strategy Tips**: Quick reminders for basic blackjack strategy

### Betting Panel (Right Sidebar)
- **Chip Display**: Current chip count with real-time updates
- **Bet Input**: Manual bet amount entry with validation
- **Quick Bet Buttons**: Instant betting with $25, $50, $100, $250 amounts
- **Bet Limits**: Enforced $10 minimum, $500 maximum, insufficient funds protection

### Session Statistics Tracking
- **Hands Played**: Total number of completed hands
- **Win/Loss/Push Breakdown**: Detailed outcome tracking with color coding
- **Win Rate**: Real-time percentage calculation
- **Net Winnings**: Profit/loss tracking with positive/negative indicators
- **Player Blackjacks**: Count of natural 21s achieved
- **Dealer Blackjacks**: Count of dealer natural 21s
- **Data Persistence**: All statistics saved automatically to localStorage

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
