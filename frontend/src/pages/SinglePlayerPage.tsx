import { useState, useEffect } from 'react'
import { BlackjackEngine } from '../utils/gameEngine'
import type { Player, GameState, BlackjackOdds } from '../types/game'
import { GameTable } from '../components/GameTable'
import { PlayerHand } from '../components/PlayerHand'
import { DealerHand } from '../components/DealerHand'
import { GameControls } from '../components/GameControls'
// import { OddsCheatSheet } from '../components/OddsCheatSheet'
import { BettingPanel } from '../components/BettingPanel'

export function SinglePlayerPage() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const deck = BlackjackEngine.createDeck()
    // Try to load saved chips from localStorage
    const savedChips = localStorage.getItem('blackjack-chips')
    const startingChips = savedChips ? parseInt(savedChips) : 1000

    const player: Player = {
      id: 'player1',
      name: 'Player',
      hand: BlackjackEngine.createHand(),
      bet: 0,
      chips: startingChips,
    }
    const dealer: Player = {
      id: 'dealer',
      name: 'Dealer',
      hand: BlackjackEngine.createHand(),
      bet: 0,
      chips: 0,
      isDealer: true,
    }

    return {
      players: [player],
      dealer,
      deck,
      currentPlayerIndex: 0,
      gamePhase: 'betting',
      minBet: 10,
      maxBet: 500,
    }
  })

  const [odds, setOdds] = useState<BlackjackOdds | null>(null)
  const [gameMessage, setGameMessage] = useState<string>('')
  // const [showStrategy, setShowStrategy] = useState(true)
  const [sessionStats, setSessionStats] = useState(() => {
    const saved = localStorage.getItem('blackjack-session')
    return saved ? JSON.parse(saved) : {
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsPushed: 0,
      totalWagered: 0,
      netWinnings: 0,
      startingChips: parseInt(localStorage.getItem('blackjack-chips') || '1000')
    }
  })

  const currentPlayer = gameState.players[gameState.currentPlayerIndex]

  useEffect(() => {
    if (gameState.gamePhase === 'playing' && currentPlayer && gameState.dealer.hand.cards.length > 0) {
      const dealerUpCard = gameState.dealer.hand.cards[0]
      const calculatedOdds = BlackjackEngine.calculateOdds(
        currentPlayer.hand,
        dealerUpCard,
        gameState.deck
      )
      setOdds(calculatedOdds)
    } else {
      setOdds(null)
    }
  }, [gameState, currentPlayer])

  const placeBet = (amount: number) => {
    if (gameState.gamePhase !== 'betting' || amount > currentPlayer.chips) return

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === currentPlayer.id
          ? { ...player, bet: amount, chips: player.chips - amount }
          : player
      ),
      gamePhase: 'dealing'
    }))

    // Auto-deal after betting
    setTimeout(() => dealInitialCards(), 500)
  }

  const dealInitialCards = () => {
    let newDeck = [...gameState.deck]
    let newPlayer = { ...currentPlayer }
    let newDealer = { ...gameState.dealer }

    // Deal two cards to player
    const playerCard1 = BlackjackEngine.dealCard(newDeck, newPlayer.hand)
    newDeck = playerCard1.newDeck
    newPlayer.hand = playerCard1.newHand

    const playerCard2 = BlackjackEngine.dealCard(newDeck, newPlayer.hand)
    newDeck = playerCard2.newDeck
    newPlayer.hand = playerCard2.newHand

    // Deal two cards to dealer (second card face down)
    const dealerCard1 = BlackjackEngine.dealCard(newDeck, newDealer.hand)
    newDeck = dealerCard1.newDeck
    newDealer.hand = dealerCard1.newHand

    const dealerCard2 = BlackjackEngine.dealCard(newDeck, newDealer.hand)
    newDeck = dealerCard2.newDeck
    newDealer.hand = dealerCard2.newHand

    setGameState(prev => ({
      ...prev,
      players: [newPlayer],
      dealer: newDealer,
      deck: newDeck,
      gamePhase: 'playing'
    }))

    // Check for blackjacks
    if (newPlayer.hand.isBlackjack || newDealer.hand.isBlackjack) {
      // If either player has blackjack, game ends immediately (no dealer play)
      setTimeout(() => endGame(newDealer), 1000)
    }
  }

  const hit = () => {
    if (gameState.gamePhase !== 'playing') return

    const result = BlackjackEngine.dealCard(gameState.deck, currentPlayer.hand)
    
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === currentPlayer.id
          ? { ...player, hand: result.newHand }
          : player
      ),
      deck: result.newDeck
    }))

    if (result.newHand.isBusted) {
      setTimeout(() => endGame(gameState.dealer), 1000)
    }
  }

  const stand = () => {
    if (gameState.gamePhase !== 'playing') return

    setGameState(prev => ({
      ...prev,
      gamePhase: 'dealer-turn'
    }))

    setTimeout(() => playDealerTurn(), 500)
  }

  const doubleDown = () => {
    if (gameState.gamePhase !== 'playing' || !BlackjackEngine.canDoubleDown(currentPlayer.hand)) return
    if (currentPlayer.chips < currentPlayer.bet) return

    const result = BlackjackEngine.dealCard(gameState.deck, currentPlayer.hand)
    
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === currentPlayer.id
          ? { 
              ...player, 
              hand: result.newHand,
              bet: player.bet * 2,
              chips: player.chips - player.bet,
              hasDoubledDown: true
            }
          : player
      ),
      deck: result.newDeck,
      gamePhase: 'dealer-turn'
    }))

    if (result.newHand.isBusted) {
      setTimeout(() => endGame(gameState.dealer), 1000)
    } else {
      setTimeout(() => playDealerTurn(), 1000)
    }
  }

  const split = () => {
    // Split implementation would go here
    // For now, just show a message
    setGameMessage('Split functionality coming soon!')
    setTimeout(() => setGameMessage(''), 3000)
  }

  const playDealerTurn = () => {
    let newDealer = { ...gameState.dealer }
    let newDeck = [...gameState.deck]

    while (BlackjackEngine.shouldDealerHit(newDealer.hand)) {
      const result = BlackjackEngine.dealCard(newDeck, newDealer.hand)
      newDealer.hand = result.newHand
      newDeck = result.newDeck
    }

    setGameState(prev => ({
      ...prev,
      dealer: newDealer,
      deck: newDeck,
      gamePhase: 'game-over'
    }))

    setTimeout(() => endGame(newDealer), 1000)
  }

  const endGame = (finalDealer?: Player) => {
    const dealerToUse = finalDealer || gameState.dealer

    // Debug logging
    console.log('=== GAME END DEBUG ===')
    console.log('Player hand:', {
      cards: currentPlayer.hand.cards,
      value: currentPlayer.hand.value,
      isBlackjack: currentPlayer.hand.isBlackjack,
      isBusted: currentPlayer.hand.isBusted
    })
    console.log('Dealer hand:', {
      cards: dealerToUse.hand.cards,
      value: dealerToUse.hand.value,
      isBlackjack: dealerToUse.hand.isBlackjack,
      isBusted: dealerToUse.hand.isBusted
    })

    const payout = BlackjackEngine.calculatePayout(
      currentPlayer.bet,
      currentPlayer.hand,
      dealerToUse.hand
    )

    const result = BlackjackEngine.determineWinner(currentPlayer.hand, dealerToUse.hand)

    console.log('Result:', result)
    console.log('Payout:', payout)
    console.log('========================')
    
    let message = ''
    if (result === 'player') {
      message = currentPlayer.hand.isBlackjack ? 'Blackjack! You win!' : 'You win!'
    } else if (result === 'dealer') {
      message = currentPlayer.hand.isBusted ? 'Busted! You lose!' : 'Dealer wins!'
    } else {
      message = 'Push! It\'s a tie!'
    }

    setGameMessage(message)

    const newChips = currentPlayer.chips + payout

    // Update session stats
    const newStats = {
      ...sessionStats,
      handsPlayed: sessionStats.handsPlayed + 1,
      handsWon: result === 'player' ? sessionStats.handsWon + 1 : sessionStats.handsWon,
      handsLost: result === 'dealer' ? sessionStats.handsLost + 1 : sessionStats.handsLost,
      handsPushed: result === 'push' ? sessionStats.handsPushed + 1 : sessionStats.handsPushed,
      totalWagered: sessionStats.totalWagered + currentPlayer.bet,
      netWinnings: sessionStats.netWinnings + (payout - currentPlayer.bet)
    }

    setSessionStats(newStats)

    // Save to localStorage
    localStorage.setItem('blackjack-chips', newChips.toString())
    localStorage.setItem('blackjack-session', JSON.stringify(newStats))

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === currentPlayer.id
          ? { ...player, chips: newChips }
          : player
      ),
      gamePhase: 'game-over'
    }))
  }

  const newGame = () => {
    const deck = BlackjackEngine.createDeck()
    
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => ({
        ...player,
        hand: BlackjackEngine.createHand(),
        bet: 0,
        hasDoubledDown: false,
        hasStood: false
      })),
      dealer: {
        ...prev.dealer,
        hand: BlackjackEngine.createHand()
      },
      deck,
      gamePhase: 'betting'
    }))

    setGameMessage('')
    setOdds(null)
  }

  const resetSession = () => {
    const newStats = {
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsPushed: 0,
      totalWagered: 0,
      netWinnings: 0,
      startingChips: currentPlayer.chips
    }
    setSessionStats(newStats)
    localStorage.setItem('blackjack-session', JSON.stringify(newStats))
  }

  return (
    <div className="single-player-page">
      <div className="game-layout">
        <GameTable>
          <div className="betting-section">
            <BettingPanel
              chips={currentPlayer.chips}
              currentBet={currentPlayer.bet}
              minBet={gameState.minBet}
              maxBet={gameState.maxBet}
              canBet={gameState.gamePhase === 'betting'}
              onPlaceBet={placeBet}
              onNewGame={newGame}
              onResetSession={resetSession}
              gamePhase={gameState.gamePhase}
              sessionStats={sessionStats}
            />
          </div>

          <DealerHand
            hand={gameState.dealer.hand}
            hideSecondCard={gameState.gamePhase === 'playing'}
          />

          <div className="game-center">
            {gameMessage && (
              <div className="game-message">{gameMessage}</div>
            )}
          </div>

          <PlayerHand
            player={currentPlayer}
            isActive={true}
          />

          <GameControls
            gamePhase={gameState.gamePhase}
            canHit={gameState.gamePhase === 'playing' && !currentPlayer.hand.isBusted}
            canStand={gameState.gamePhase === 'playing'}
            canDoubleDown={gameState.gamePhase === 'playing' && BlackjackEngine.canDoubleDown(currentPlayer.hand) && currentPlayer.chips >= currentPlayer.bet}
            canSplit={gameState.gamePhase === 'playing' && BlackjackEngine.canSplit(currentPlayer.hand) && currentPlayer.chips >= currentPlayer.bet}
            onHit={hit}
            onStand={stand}
            onDoubleDown={doubleDown}
            onSplit={split}
            onNewGame={newGame}
            odds={odds}
          />
        </GameTable>
      </div>
    </div>
  )
}
