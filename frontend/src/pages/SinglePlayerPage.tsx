import { useState, useEffect } from 'react'
import { BlackjackEngine } from '../utils/gameEngine'
import type { Player, GameState, BlackjackOdds } from '../types/game'
import { GameTable } from '../components/GameTable'
import { PlayerHand } from '../components/PlayerHand'
import { DealerHand } from '../components/DealerHand'
import { GameControls } from '../components/GameControls'
// import { OddsCheatSheet } from '../components/OddsCheatSheet'
import { BettingPanel } from '../components/BettingPanel'
import { GameControlsPanel } from '../components/GameControlsPanel'
import { GameMessagePanel } from '../components/GameMessagePanel'

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
  const [autoPlay, setAutoPlay] = useState(false)
  const [lastBetAmount, setLastBetAmount] = useState(0)
  const [autoPlayCountdown, setAutoPlayCountdown] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Add debug function to global scope for easy testing
    ;(window as any).resetToFreshSession = () => {
      localStorage.removeItem('blackjack-chips')
      localStorage.removeItem('blackjack-session')
      window.location.reload()
    }

    console.log('Debug: Use resetToFreshSession() to clear all data and start fresh with 1000 chips')

    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  // const [showStrategy, setShowStrategy] = useState(true)
  const [sessionStats, setSessionStats] = useState(() => {
    const saved = localStorage.getItem('blackjack-session')
    const defaultStats = {
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsPushed: 0,
      totalWagered: 0,
      netWinnings: 0,
      winRate: 0,
      playerBlackjacks: 0,
      dealerBlackjacks: 0,
      startingChips: parseInt(localStorage.getItem('blackjack-chips') || '1000')
    }

    if (saved) {
      const parsedStats = JSON.parse(saved)
      // Migrate old session stats to include new properties
      return {
        ...defaultStats,
        ...parsedStats,
        playerBlackjacks: parsedStats.playerBlackjacks || 0,
        dealerBlackjacks: parsedStats.dealerBlackjacks || 0,
        winRate: parsedStats.winRate || 0
      }
    }

    return defaultStats
  })

  const currentPlayer = gameState.players[gameState.currentPlayerIndex]

  // Debug: Log current player chips whenever they change
  useEffect(() => {
    console.log('Current player chips:', currentPlayer.chips)
  }, [currentPlayer.chips])

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

    console.log('Placing bet:', amount, 'Current chips:', currentPlayer.chips)
    setLastBetAmount(amount) // Track the last bet for auto-play

    setGameState(prev => {
      const updatedState = {
        ...prev,
        players: prev.players.map(player =>
          player.id === currentPlayer.id
            ? { ...player, bet: amount, chips: player.chips - amount }
            : player
        ),
        gamePhase: 'dealing' as const
      }

      console.log('After bet placement - New chips:', updatedState.players[0].chips)

      // Auto-deal after betting using the updated state
      setTimeout(() => dealInitialCardsWithState(updatedState), 500)

      return updatedState
    })
  }

  const dealInitialCardsWithState = (currentGameState: typeof gameState) => {
    let newDeck = [...currentGameState.deck]
    // Use the passed state to ensure we have the correct state with bet deducted
    let newPlayer = { ...currentGameState.players[currentGameState.currentPlayerIndex] }
    let newDealer = { ...currentGameState.dealer }

    console.log('Deal Initial Cards With State - Player chips:', newPlayer.chips, 'bet:', newPlayer.bet)

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
      gamePhase: 'playing' as const
    }))

    // Check for blackjacks
    if (newPlayer.hand.isBlackjack || newDealer.hand.isBlackjack) {
      // If either player has blackjack, reveal dealer's cards and end game
      setGameState(prev => ({
        ...prev,
        players: [newPlayer],
        dealer: newDealer,
        deck: newDeck,
        gamePhase: 'game-over' as const
      }))
      setTimeout(() => endGame(newDealer), 1000)
    }
  }




  const hit = () => {
    if (gameState.gamePhase !== 'playing') return

    // Check if we're playing split hands
    if (currentPlayer.splitHands && currentPlayer.currentHandIndex !== undefined) {
      const handIndex = currentPlayer.currentHandIndex;
      const currentSplitHand = currentPlayer.splitHands[handIndex];

      const result = BlackjackEngine.dealCard(gameState.deck, currentSplitHand);

      console.log('=== HIT RESULT (Split Hand', handIndex + 1, ') ===')
      console.log('New hand value:', result.newHand.value)
      console.log('New hand isBusted:', result.newHand.isBusted)
      console.log('Cards:', result.newHand.cards.map(c => c.rank))

      const newSplitHands = [...currentPlayer.splitHands];
      newSplitHands[handIndex] = result.newHand;

      setGameState(prev => ({
        ...prev,
        players: prev.players.map(player =>
          player.id === currentPlayer.id
            ? {
                ...player,
                splitHands: newSplitHands,
                hand: newSplitHands[handIndex] // Update main hand to current split hand
              }
            : player
        ),
        deck: result.newDeck
      }))

      if (result.newHand.isBusted) {
        console.log('🚨 Split hand', handIndex + 1, 'busted! Moving to next hand...')
        console.log('Split hand value:', result.newHand.value)
        console.log('Split hand cards:', result.newHand.cards.map(c => c.rank))
        console.log('Split hand isBusted:', result.newHand.isBusted)
        setTimeout(() => moveToNextSplitHand(), 1000)
      } else {
        console.log('Split hand', handIndex + 1, 'did not bust, continuing...')
      }
    } else {
      // Regular single hand hit
      const result = BlackjackEngine.dealCard(gameState.deck, currentPlayer.hand)

      console.log('=== HIT RESULT ===')
      console.log('New hand value:', result.newHand.value)
      console.log('New hand isBusted:', result.newHand.isBusted)
      console.log('Cards:', result.newHand.cards.map(c => c.rank))

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
        console.log('🚨 Player busted on hit! Ending game...')
        console.log('Player hand value:', result.newHand.value)
        console.log('Player cards:', result.newHand.cards.map(c => c.rank))
        console.log('Player isBusted:', result.newHand.isBusted)
        // Don't pass dealer state - let endGame get current state
        setTimeout(() => endGame(), 1000)
      } else {
        console.log('Player did not bust, continuing...')
      }
    }
  }

  const moveToNextSplitHand = () => {
    if (!currentPlayer.splitHands || currentPlayer.currentHandIndex === undefined) {
      return;
    }

    const nextHandIndex = currentPlayer.currentHandIndex + 1;

    if (nextHandIndex < currentPlayer.splitHands.length) {
      // Move to next split hand
      console.log('Moving to split hand', nextHandIndex + 1);
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(player =>
          player.id === currentPlayer.id
            ? {
                ...player,
                currentHandIndex: nextHandIndex,
                hand: player.splitHands![nextHandIndex] // Update main hand to current split hand
              }
            : player
        )
      }));

      setGameMessage(`Playing hand ${nextHandIndex + 1} of ${currentPlayer.splitHands.length}...`);
      setTimeout(() => setGameMessage(''), 2000);
    } else {
      // All split hands completed, play dealer turn
      console.log('All split hands completed, playing dealer turn...');
      setTimeout(() => playDealerTurn(), 1000);
    }
  };

  const stand = () => {
    if (gameState.gamePhase !== 'playing') return

    // Check if we're playing split hands
    if (currentPlayer.splitHands && currentPlayer.currentHandIndex !== undefined) {
      console.log('Standing on split hand', currentPlayer.currentHandIndex + 1);
      setTimeout(() => moveToNextSplitHand(), 1000);
    } else {
      // Regular single hand stand
      setGameState(prev => ({
        ...prev,
        gamePhase: 'dealer-turn' as const
      }))

      setTimeout(() => playDealerTurn(), 500)
    }
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
    if (gameState.gamePhase !== 'playing' || !BlackjackEngine.canSplit(currentPlayer.hand) || currentPlayer.chips < currentPlayer.bet) {
      return;
    }

    console.log('=== SPLIT ACTION ===')
    console.log('Original hand:', currentPlayer.hand.cards.map(c => c.rank))
    console.log('Bet amount:', currentPlayer.bet)
    console.log('Chips before split:', currentPlayer.chips)

    // Split the hand into two hands
    const { hand1, hand2 } = BlackjackEngine.splitHand(currentPlayer.hand);

    // Deal a second card to each split hand
    let newDeck = [...gameState.deck];

    // Deal second card to first hand
    const firstHandResult = BlackjackEngine.dealCard(newDeck, hand1);
    newDeck = firstHandResult.newDeck;
    const completedHand1 = firstHandResult.newHand;

    // Deal second card to second hand
    const secondHandResult = BlackjackEngine.dealCard(newDeck, hand2);
    newDeck = secondHandResult.newDeck;
    const completedHand2 = secondHandResult.newHand;

    console.log('Split hands after dealing second cards:')
    console.log('Hand 1:', completedHand1.cards.map(c => c.rank), 'Value:', completedHand1.value)
    console.log('Hand 2:', completedHand2.cards.map(c => c.rank), 'Value:', completedHand2.value)

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === currentPlayer.id
          ? {
              ...player,
              hand: completedHand1, // First split hand becomes the main hand
              splitHands: [completedHand1, completedHand2], // Store both completed split hands
              currentHandIndex: 0, // Start with first hand
              chips: player.chips - player.bet, // Deduct additional bet for second hand
              bet: player.bet // Each hand has the same bet amount
            }
          : player
      ),
      deck: newDeck // Update deck after dealing cards
    }));

    // Check if either split hand has blackjack (especially for split Aces)
    if (completedHand1.isBlackjack || completedHand2.isBlackjack) {
      console.log('Split hand(s) have blackjack!')
      if (completedHand1.isBlackjack) console.log('Hand 1 has blackjack')
      if (completedHand2.isBlackjack) console.log('Hand 2 has blackjack')
    }

    setGameMessage('Hand split! Playing first hand...');
    setTimeout(() => setGameMessage(''), 3000);
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
    // CRITICAL FIX: Get current player from current game state, not closure
    const currentPlayerFromState = gameState.players[gameState.currentPlayerIndex]

    // Debug logging
    console.log('=== GAME END DEBUG ===')
    console.log('endGame called with finalDealer:', finalDealer ? 'YES' : 'NO')
    console.log('🔍 BUST INVESTIGATION:')
    console.log('currentPlayer from closure vs state:', {
      closureValue: currentPlayer.hand.value,
      closureBusted: currentPlayer.hand.isBusted,
      stateValue: currentPlayerFromState.hand.value,
      stateBusted: currentPlayerFromState.hand.isBusted,
      stateCards: currentPlayerFromState.hand.cards.map(c => c.rank)
    })
    console.log('Dealer state:', {
      value: dealerToUse.hand.value,
      cards: dealerToUse.hand.cards.map(c => c.rank),
      isBusted: dealerToUse.hand.isBusted
    })

    // Handle split hands
    if (currentPlayerFromState.splitHands && currentPlayerFromState.splitHands.length > 0) {
      console.log('Processing split hands...')
      let totalPayout = 0;
      let results: string[] = [];

      for (let i = 0; i < currentPlayerFromState.splitHands.length; i++) {
        const splitHand = currentPlayerFromState.splitHands[i];
        const handPayout = BlackjackEngine.calculatePayout(currentPlayerFromState.bet, splitHand, dealerToUse.hand);
        const handResult = BlackjackEngine.determineWinner(splitHand, dealerToUse.hand);

        totalPayout += handPayout;
        results.push(`Hand ${i + 1}: ${handResult} (${splitHand.value})`);

        console.log(`Split Hand ${i + 1}:`, {
          cards: splitHand.cards.map(c => c.rank),
          value: splitHand.value,
          result: handResult,
          payout: handPayout
        });
      }

      console.log('Total split payout:', totalPayout);
      console.log('Split results:', results);

      const newChips = currentPlayerFromState.chips + totalPayout;

      // Update session stats for split hands
      let handsWon = 0;
      let handsLost = 0;
      let handsPushed = 0;
      let playerBlackjacks = 0;
      let dealerBlackjacks = 0;

      for (const splitHand of currentPlayerFromState.splitHands) {
        const handResult = BlackjackEngine.determineWinner(splitHand, dealerToUse.hand);
        if (handResult === 'player') handsWon++;
        else if (handResult === 'dealer') handsLost++;
        else handsPushed++;

        if (splitHand.isBlackjack) playerBlackjacks++;
        if (dealerToUse.hand.isBlackjack) dealerBlackjacks++;
      }

      const handsPlayed = sessionStats.handsPlayed + currentPlayerFromState.splitHands.length;
      const totalHandsWon = sessionStats.handsWon + handsWon;

      const newStats = {
        ...sessionStats,
        handsPlayed,
        handsWon: totalHandsWon,
        handsLost: sessionStats.handsLost + handsLost,
        handsPushed: sessionStats.handsPushed + handsPushed,
        totalWagered: sessionStats.totalWagered + (currentPlayerFromState.bet * currentPlayerFromState.splitHands.length),
        netWinnings: sessionStats.netWinnings + (totalPayout - (currentPlayerFromState.bet * currentPlayerFromState.splitHands.length)),
        winRate: handsPlayed > 0 ? (totalHandsWon / handsPlayed) * 100 : 0,
        playerBlackjacks: (sessionStats.playerBlackjacks || 0) + playerBlackjacks,
        dealerBlackjacks: (sessionStats.dealerBlackjacks || 0) + dealerBlackjacks
      };

      setSessionStats(newStats);
      localStorage.setItem('blackjack-session', JSON.stringify(newStats));

      setGameMessage(`Split complete! ${results.join(', ')}`);

      // Clear split hands and reset to normal play
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(player =>
          player.id === currentPlayerFromState.id
            ? {
                ...player,
                chips: newChips,
                splitHands: undefined,
                currentHandIndex: undefined,
                hand: BlackjackEngine.createHand() // Reset to empty hand
              }
            : player
        ),
        gamePhase: 'game-over' as const
      }));

      return; // Exit early for split hands
    }

    // Regular single hand processing
    console.log('Player hand (from state):', {
      cards: currentPlayerFromState.hand.cards,
      value: currentPlayerFromState.hand.value,
      isBlackjack: currentPlayerFromState.hand.isBlackjack,
      isBusted: currentPlayerFromState.hand.isBusted
    })
    console.log('Dealer hand:', {
      cards: dealerToUse.hand.cards,
      value: dealerToUse.hand.value,
      isBlackjack: dealerToUse.hand.isBlackjack,
      isBusted: dealerToUse.hand.isBusted
    })

    // Double-check bust calculation
    const playerShouldBeBusted = currentPlayerFromState.hand.value > 21
    console.log('Player value > 21?', playerShouldBeBusted)
    console.log('Player isBusted property:', currentPlayerFromState.hand.isBusted)
    if (playerShouldBeBusted !== currentPlayerFromState.hand.isBusted) {
      console.error('🚨 BUST DETECTION MISMATCH! Value > 21 but isBusted is wrong!')
    }

    const payout = BlackjackEngine.calculatePayout(
      currentPlayerFromState.bet,
      currentPlayerFromState.hand,
      dealerToUse.hand
    )

    const result = BlackjackEngine.determineWinner(currentPlayerFromState.hand, dealerToUse.hand)

    console.log('=== PAYOUT CALCULATION ===')
    console.log('Player hand:', currentPlayerFromState.hand.value, 'cards:', currentPlayerFromState.hand.cards.length)
    console.log('Dealer hand:', dealerToUse.hand.value, 'cards:', dealerToUse.hand.cards.length)
    console.log('Bet amount:', currentPlayerFromState.bet)
    console.log('Result:', result)
    console.log('Payout:', payout)
    console.log('Expected for win: bet + bet =', currentPlayerFromState.bet + currentPlayerFromState.bet)
    console.log('========================')

    let message = ''
    if (result === 'player') {
      message = currentPlayerFromState.hand.isBlackjack ? 'Blackjack! You win!' : 'You win!'
    } else if (result === 'dealer') {
      message = currentPlayerFromState.hand.isBusted ? 'Busted! You lose!' : 'Dealer wins!'
    } else {
      message = 'Push! It\'s a tie!'
    }

    setGameMessage(message)

    const newChips = currentPlayerFromState.chips + payout

    // Debug chip calculation
    console.log('Chip Calculation:', {
      currentChips: currentPlayerFromState.chips,
      bet: currentPlayerFromState.bet,
      payout,
      newChips,
      result,
      shouldGain: result === 'player' ? currentPlayerFromState.bet : 0
    })

    // Update session stats
    const handsPlayed = sessionStats.handsPlayed + 1
    const handsWon = result === 'player' ? sessionStats.handsWon + 1 : sessionStats.handsWon

    // Check for blackjacks
    const playerHasBlackjack = currentPlayerFromState.hand.isBlackjack
    const dealerHasBlackjack = dealerToUse.hand.isBlackjack

    // Debug logging
    console.log('Blackjack Detection:', {
      playerCards: currentPlayerFromState.hand.cards.length,
      playerValue: currentPlayerFromState.hand.value,
      playerHasBlackjack,
      dealerCards: dealerToUse.hand.cards.length,
      dealerValue: dealerToUse.hand.value,
      dealerHasBlackjack
    })

    const newStats = {
      ...sessionStats,
      handsPlayed,
      handsWon,
      handsLost: result === 'dealer' ? sessionStats.handsLost + 1 : sessionStats.handsLost,
      handsPushed: result === 'push' ? sessionStats.handsPushed + 1 : sessionStats.handsPushed,
      totalWagered: sessionStats.totalWagered + currentPlayerFromState.bet,
      netWinnings: sessionStats.netWinnings + (payout - currentPlayerFromState.bet),
      winRate: handsPlayed > 0 ? (handsWon / handsPlayed) * 100 : 0,
      playerBlackjacks: (sessionStats.playerBlackjacks || 0) + (playerHasBlackjack ? 1 : 0),
      dealerBlackjacks: (sessionStats.dealerBlackjacks || 0) + (dealerHasBlackjack ? 1 : 0)
    }

    // Debug session stats
    console.log('Session Stats Update:', {
      bet: currentPlayerFromState.bet,
      payout,
      result,
      oldNetWinnings: sessionStats.netWinnings,
      newNetWinnings: newStats.netWinnings,
      oldPlayerBJ: sessionStats.playerBlackjacks,
      newPlayerBJ: newStats.playerBlackjacks,
      oldDealerBJ: sessionStats.dealerBlackjacks,
      newDealerBJ: newStats.dealerBlackjacks
    })

    setSessionStats(newStats)

    // Save to localStorage
    localStorage.setItem('blackjack-chips', newChips.toString())
    localStorage.setItem('blackjack-session', JSON.stringify(newStats))

    setGameState(prev => {
      const updatedState = {
        ...prev,
        players: prev.players.map(player =>
          player.id === currentPlayerFromState.id
            ? { ...player, chips: newChips }
            : player
        ),
        gamePhase: 'game-over' as const
      }

      console.log('Game State Update:', {
        oldChips: currentPlayerFromState.chips,
        newChips,
        updatedPlayerChips: updatedState.players[0].chips
      })

      return updatedState
    })

    // Auto-play: automatically start next hand if enabled
    console.log('=== AUTO-PLAY CHECK ===')
    console.log('Auto-play state:', {
      autoPlay,
      lastBetAmount,
      newChips,
      canAfford: newChips >= lastBetAmount,
      gamePhase: gameState.gamePhase,
      currentCountdown: autoPlayCountdown
    })

    if (autoPlay && lastBetAmount > 0 && newChips >= lastBetAmount && autoPlayCountdown === 0) {
      console.log('✅ Auto-play conditions met, starting countdown...')
      // Start countdown (only if not already counting down)
      setAutoPlayCountdown(2)
      const countdownInterval = setInterval(() => {
        setAutoPlayCountdown(prev => {
          console.log('Auto-play countdown:', prev)
          if (prev <= 1) {
            clearInterval(countdownInterval)
            console.log('Auto-play countdown finished, starting new hand...')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      setTimeout(() => {
        console.log('=== AUTO-PLAY TIMEOUT EXECUTING ===')

        // Check if auto-play is still enabled and conditions are still met
        setGameState(currentGameState => {
          const currentPlayerFromState = currentGameState.players[currentGameState.currentPlayerIndex]

          console.log('Auto-play timeout check:', {
            autoPlayStillEnabled: autoPlay,
            gamePhase: currentGameState.gamePhase,
            playerChips: currentPlayerFromState.chips,
            lastBetAmount,
            canAfford: currentPlayerFromState.chips >= lastBetAmount
          })

          // Verify auto-play should still continue
          if (!autoPlay || lastBetAmount === 0 || currentPlayerFromState.chips < lastBetAmount) {
            console.log('❌ Auto-play conditions no longer met, aborting auto-play')
            setAutoPlay(false)
            setAutoPlayCountdown(0)
            return currentGameState // Don't change game state
          }

          // Reset game state and immediately deal next hand
          const deck = BlackjackEngine.createDeck()
          let newDeck = [...deck]

          // Create new player with bet already placed
          console.log('Auto-play: Creating new player with chips:', currentPlayerFromState.chips, 'bet:', lastBetAmount)
          const newPlayer: Player = {
            ...currentPlayerFromState,
            hand: BlackjackEngine.createHand(),
            bet: lastBetAmount,
            chips: currentPlayerFromState.chips - lastBetAmount, // Deduct the bet from current chips
            hasDoubledDown: false,
            hasStood: false
          }
          console.log('Auto-play: New player chips after bet:', newPlayer.chips)

          // Deal player cards
          const playerCard1 = BlackjackEngine.dealCard(newDeck, newPlayer.hand)
          newDeck = playerCard1.newDeck
          newPlayer.hand = playerCard1.newHand

          const playerCard2 = BlackjackEngine.dealCard(newDeck, newPlayer.hand)
          newDeck = playerCard2.newDeck
          newPlayer.hand = playerCard2.newHand

          // Create new dealer
          const newDealer: Player = {
            ...currentGameState.dealer,
            hand: BlackjackEngine.createHand()
          }

          // Deal dealer cards
          const dealerCard1 = BlackjackEngine.dealCard(newDeck, newDealer.hand)
          newDeck = dealerCard1.newDeck
          newDealer.hand = dealerCard1.newHand

          const dealerCard2 = BlackjackEngine.dealCard(newDeck, newDealer.hand)
          newDealer.hand = dealerCard2.newHand

          // Create the new game state
          const newGameState = {
            ...currentGameState,
            players: [newPlayer],
            dealer: newDealer,
            deck: newDeck,
            gamePhase: 'playing' as const // Go directly to playing phase
          }

          console.log('✅ Auto-play: New game state created, returning to React')

          // Reset other state outside of setGameState
          setTimeout(() => {
            setGameMessage('')
            setOdds(null)
            setAutoPlayCountdown(0)

            // Check for blackjacks after state is set
            if (newPlayer.hand.isBlackjack || newDealer.hand.isBlackjack) {
              console.log('Auto-play: Blackjack detected, ending game immediately')
              setGameState(prev => ({
                ...prev,
                gamePhase: 'game-over' as const
              }))
              setTimeout(() => endGame(newDealer), 1000)
            }
          }, 100) // Small delay to ensure state is updated

          return newGameState
        }) // End of setGameState callback
      }, 2000) // Wait 2 seconds to show results, then auto-start next hand
    } else if (autoPlay && newChips < lastBetAmount) {
      // Disable auto-play if not enough chips
      setAutoPlay(false)
      setGameMessage('Auto-play disabled: insufficient chips')
      setTimeout(() => setGameMessage(''), 3000)
    } else if (autoPlay && lastBetAmount === 0) {
      // Disable auto-play if no previous bet amount
      setAutoPlay(false)
      setGameMessage('Auto-play disabled: no previous bet amount')
      setTimeout(() => setGameMessage(''), 3000)
    } else if (autoPlay) {
      // Fallback: If auto-play is enabled but didn't continue for any other reason, disable it
      console.warn('Auto-play enabled but failed to continue. Disabling auto-play.', {
        autoPlay,
        lastBetAmount,
        newChips,
        canAfford: newChips >= lastBetAmount
      })
      setAutoPlay(false)
      setGameMessage('Auto-play disabled: unexpected error')
      setTimeout(() => setGameMessage(''), 3000)
    }
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
    const startingChips = 1000 // Always reset to 1000 chips

    // Reset player chips to 1000
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === currentPlayer.id
          ? { ...player, chips: startingChips, bet: 0 }
          : player
      ),
      gamePhase: 'betting' as const
    }))

    // Reset session stats
    const newStats = {
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsPushed: 0,
      totalWagered: 0,
      netWinnings: 0,
      winRate: 0,
      playerBlackjacks: 0,
      dealerBlackjacks: 0,
      startingChips
    }

    setSessionStats(newStats)

    // Save to localStorage
    localStorage.setItem('blackjack-chips', startingChips.toString())
    localStorage.setItem('blackjack-session', JSON.stringify(newStats))

    console.log('Session reset - chips set to:', startingChips)
  }

  return (
    <div className="single-player-page">
      <div className="game-layout">
        {isMobile ? (
          // Mobile Layout: Controls panel, betting panel, then game table
          <>
            <div className="mobile-controls-section">
              <GameControlsPanel
                sessionStats={sessionStats}
                onResetSession={resetSession}
                gamePhase={gameState.gamePhase}
              />
            </div>
            <div className="mobile-betting-section">
              <GameMessagePanel
                message={gameMessage}
                gamePhase={gameState.gamePhase}
              />
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
                autoPlay={autoPlay}
                lastBetAmount={lastBetAmount}
                autoPlayCountdown={autoPlayCountdown}
                onAutoPlayChange={setAutoPlay}
              />
            </div>
            <GameTable>
              <DealerHand
                hand={gameState.dealer.hand}
                hideSecondCard={gameState.gamePhase === 'playing'}
              />



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
          </>
        ) : (
          // Desktop Layout: Left controls panel, betting panel on right
          <GameTable>
            <div className="game-controls-panel">
              <GameControlsPanel
                sessionStats={sessionStats}
                onResetSession={resetSession}
                gamePhase={gameState.gamePhase}
              />
            </div>

            <div className="betting-section">
              <GameMessagePanel
                message={gameMessage}
                gamePhase={gameState.gamePhase}
              />
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
                autoPlay={autoPlay}
                lastBetAmount={lastBetAmount}
                autoPlayCountdown={autoPlayCountdown}
                onAutoPlayChange={setAutoPlay}
              />
            </div>

            <DealerHand
              hand={gameState.dealer.hand}
              hideSecondCard={gameState.gamePhase === 'playing'}
            />



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
        )}
      </div>
    </div>
  )
}
