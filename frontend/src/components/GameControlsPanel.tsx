

interface SessionStats {
  handsPlayed: number
  handsWon: number
  handsLost: number
  handsPushed: number
  totalWagered: number
  netWinnings: number
  winRate: number
  startingChips: number
}

interface GameControlsPanelProps {
  autoPlay?: boolean
  onAutoPlayChange?: (enabled: boolean) => void
  lastBetAmount?: number
  sessionStats?: SessionStats
  onResetSession?: () => void
  gamePhase: string
}

export function GameControlsPanel({
  autoPlay = false,
  onAutoPlayChange,
  lastBetAmount = 0,
  sessionStats,
  onResetSession,
  gamePhase
}: GameControlsPanelProps) {
  return (
    <div className="game-controls-panel">
      <div className="panel-section">
        <h3 className="panel-title">Game Settings</h3>
        
        {/* Auto-Play Section */}
        <div className="auto-play-section">
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

      {/* Session Statistics */}
      {sessionStats && (
        <div className="panel-section">
          <h3 className="panel-title">Session Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Hands:</span>
              <span className="stat-value">{sessionStats.handsPlayed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Won:</span>
              <span className="stat-value text-green">{sessionStats.handsWon}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lost:</span>
              <span className="stat-value text-red">{sessionStats.handsLost}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pushed:</span>
              <span className="stat-value text-yellow">{sessionStats.handsPushed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Win Rate:</span>
              <span className="stat-value">{sessionStats.winRate.toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Net:</span>
              <span className={`stat-value ${sessionStats.netWinnings >= 0 ? 'text-green' : 'text-red'}`}>
                {sessionStats.netWinnings >= 0 ? '+' : ''}${sessionStats.netWinnings}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Session Controls */}
      <div className="panel-section">
        <h3 className="panel-title">Session</h3>
        <button
          className="btn btn-secondary reset-btn"
          onClick={onResetSession}
          disabled={gamePhase === 'playing'}
        >
          Reset Session
        </button>
        <div className="reset-info">
          Resets stats and restores starting chips
        </div>
      </div>

      {/* Strategy Tips */}
      <div className="panel-section">
        <h3 className="panel-title">Quick Tips</h3>
        <div className="tips-list">
          <div className="tip-item">
            <strong>Basic Strategy:</strong> Hit on 16 vs dealer 7+
          </div>
          <div className="tip-item">
            <strong>Double Down:</strong> 11 vs dealer 2-10
          </div>
          <div className="tip-item">
            <strong>Split:</strong> Always split Aces and 8s
          </div>
        </div>
      </div>
    </div>
  )
}
