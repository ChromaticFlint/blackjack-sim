import { useState } from 'react'

interface SessionStats {
  handsPlayed: number
  handsWon: number
  handsLost: number
  handsPushed: number
  totalWagered: number
  netWinnings: number
  startingChips: number
}

interface BettingPanelProps {
  chips: number
  currentBet: number
  minBet: number
  maxBet: number
  canBet: boolean
  onPlaceBet: (amount: number) => void
  onNewGame: () => void
  onResetSession?: () => void
  gamePhase: string
  sessionStats?: SessionStats
  autoPlay?: boolean
  lastBetAmount?: number
  autoPlayCountdown?: number
  onAutoPlayChange?: (enabled: boolean) => void
}

export function BettingPanel({
  chips,
  currentBet,
  minBet,
  maxBet,
  canBet,
  onPlaceBet,
  onNewGame,
  gamePhase,
  autoPlay = false,
  lastBetAmount = 0,
  autoPlayCountdown = 0,
  onAutoPlayChange
}: BettingPanelProps) {
  const [betAmount, setBetAmount] = useState(minBet)

  const quickBets = [10, 25, 50, 100, 250]

  const handleBetChange = (amount: number) => {
    const clampedAmount = Math.max(minBet, Math.min(maxBet, Math.min(chips, amount)))
    setBetAmount(clampedAmount)
  }

  const handlePlaceBet = () => {
    if (canBet && betAmount <= chips) {
      onPlaceBet(betAmount)
    }
  }

  return (
    <div className="panel-section betting-panel">
      <h3 className="panel-title">Betting</h3>
      
      <div className="chips-info">
        <div className="chips-total">
          <span className="label">Total Chips:</span>
          <span className="amount">${chips}</span>
        </div>
        {currentBet > 0 && (
          <div className="current-bet">
            <span className="label">Current Bet:</span>
            <span className="amount">${currentBet}</span>
          </div>
        )}
      </div>



      {canBet && (
        <>
          <div className="bet-input">
            <label htmlFor="bet-amount">Bet Amount:</label>
            <input
              id="bet-amount"
              type="number"
              min={minBet}
              max={Math.min(maxBet, chips)}
              value={betAmount}
              onChange={(e) => handleBetChange(parseInt(e.target.value) || minBet)}
              className="bet-input-field"
            />
          </div>

          <div className="quick-bets">
            <div className="quick-bets-label">Quick Bets:</div>
            <div className="quick-bet-buttons">
              {quickBets.map(amount => (
                <button
                  key={amount}
                  className={`quick-bet-btn ${betAmount === amount ? 'active' : ''}`}
                  onClick={() => handleBetChange(amount)}
                  disabled={amount > chips}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>



          <button
            className="btn btn-primary place-bet-btn"
            onClick={handlePlaceBet}
            disabled={!canBet || betAmount > chips || betAmount < minBet}
          >
            Place Bet (${betAmount})
          </button>
        </>
      )}

      {!canBet && currentBet === 0 && (
        <div className="betting-message">
          Game in progress
        </div>
      )}

      {gamePhase === 'game-over' && !autoPlay && (
        <button
          className="btn btn-primary new-game-btn"
          onClick={onNewGame}
        >
          New Game
        </button>
      )}

      {gamePhase === 'game-over' && autoPlay && lastBetAmount > 0 && (
        <div className="auto-play-message">
          {autoPlayCountdown > 0
            ? `Next hand in ${autoPlayCountdown}...`
            : 'Next hand starting automatically...'
          }
        </div>
      )}

      {/* Fallback: Show New Game button if auto-play is enabled but can't continue */}
      {gamePhase === 'game-over' && autoPlay && lastBetAmount === 0 && (
        <div>
          <div className="auto-play-message error">
            Auto-play disabled: No previous bet amount
          </div>
          <button
            className="btn btn-primary new-game-btn"
            onClick={onNewGame}
          >
            New Game
          </button>
        </div>
      )}

      {/* Auto-Play Controls */}
      <div className="panel-section auto-play">
        <h4 className="panel-title">Auto-Play</h4>
        <label className="auto-play-checkbox">
          <input
            type="checkbox"
            checked={autoPlay}
            onChange={(e) => onAutoPlayChange?.(e.target.checked)}
          />
          Auto-play {lastBetAmount > 0 ? `($${lastBetAmount})` : '(place bet first)'}
        </label>
        {autoPlay && lastBetAmount > 0 && (
          <div className="auto-play-info">
            Automatically repeats ${lastBetAmount} bets
          </div>
        )}
      </div>
    </div>
  )
}
