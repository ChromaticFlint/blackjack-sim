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
  onAutoPlayChange?: (enabled: boolean) => void
  lastBetAmount?: number
}

export function BettingPanel({
  chips,
  currentBet,
  minBet,
  maxBet,
  canBet,
  onPlaceBet,
  onNewGame,
  onResetSession,
  gamePhase,
  sessionStats,
  autoPlay = false,
  onAutoPlayChange,
  lastBetAmount = 0
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
    <div className="betting-panel">
      <h3>Betting</h3>
      
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

      {sessionStats && sessionStats.handsPlayed > 0 && (
        <div className="session-stats">
          <h4>Session Stats</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Hands:</span>
              <span className="stat-value">{sessionStats.handsPlayed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Won:</span>
              <span className="stat-value">{sessionStats.handsWon}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lost:</span>
              <span className="stat-value">{sessionStats.handsLost}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pushed:</span>
              <span className="stat-value">{sessionStats.handsPushed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Win Rate:</span>
              <span className="stat-value">
                {sessionStats.handsPlayed > 0 ?
                  `${((sessionStats.handsWon / sessionStats.handsPlayed) * 100).toFixed(1)}%` :
                  '0%'
                }
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Net:</span>
              <span className={`stat-value ${sessionStats.netWinnings >= 0 ? 'positive' : 'negative'}`}>
                {sessionStats.netWinnings >= 0 ? '+' : ''}${sessionStats.netWinnings}
              </span>
            </div>
          </div>
          {onResetSession && (
            <button
              className="btn btn-secondary reset-session-btn"
              onClick={onResetSession}
              title="Reset session statistics"
            >
              Reset Session
            </button>
          )}
        </div>
      )}

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

          <div className="auto-play-section">
            <label className="auto-play-checkbox">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => onAutoPlayChange?.(e.target.checked)}
              />
              <span className="checkmark"></span>
              Auto-play {lastBetAmount > 0 ? `($${lastBetAmount})` : ''}
            </label>
            {autoPlay && lastBetAmount > 0 && (
              <div className="auto-play-info">
                Will automatically repeat ${lastBetAmount} bets
              </div>
            )}
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

      {gamePhase === 'game-over' && (
        <button
          className="btn btn-primary new-game-btn"
          onClick={onNewGame}
        >
          New Game
        </button>
      )}
    </div>
  )
}
