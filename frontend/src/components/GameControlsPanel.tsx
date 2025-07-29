

interface SessionStats {
  handsPlayed: number
  handsWon: number
  handsLost: number
  handsPushed: number
  totalWagered: number
  netWinnings: number
  winRate: number
  startingChips: number
  playerBlackjacks: number
  dealerBlackjacks: number
}

interface GameControlsPanelProps {
  sessionStats?: SessionStats
  onResetSession?: () => void
  gamePhase: string
  onTestSplit?: () => void
  splitTestMode?: boolean
}

export function GameControlsPanel({
  sessionStats,
  onResetSession,
  gamePhase,
  onTestSplit,
  splitTestMode = false
}: GameControlsPanelProps) {
  return (
    <div className="game-controls-panel">

      {/* Session Statistics */}
      {sessionStats && (
        <div className="panel-section session-stats">
          <h3 className="panel-title">Session Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Hands:</span>
              <span className="stat-value">{sessionStats.handsPlayed || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Won:</span>
              <span className="stat-value text-green">{sessionStats.handsWon || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lost:</span>
              <span className="stat-value text-red">{sessionStats.handsLost || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pushed:</span>
              <span className="stat-value text-yellow">{sessionStats.handsPushed || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Win Rate:</span>
              <span className="stat-value">{(sessionStats.winRate || 0).toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Net:</span>
              <span className={`stat-value ${(sessionStats.netWinnings || 0) >= 0 ? 'text-green' : 'text-red'}`}>
                {(sessionStats.netWinnings || 0) >= 0 ? '+' : ''}${sessionStats.netWinnings || 0}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Player BJ:</span>
              <span className="stat-value text-gold">{sessionStats.playerBlackjacks || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Dealer BJ:</span>
              <span className="stat-value text-gold">{sessionStats.dealerBlackjacks || 0}</span>
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

      {/* Split Testing */}
      <div className="panel-section">
        <h3 className="panel-title">Split Testing</h3>
        <button
          className={`btn ${splitTestMode ? 'btn-warning' : 'btn-secondary'} test-split-btn`}
          onClick={onTestSplit}
          disabled={gamePhase === 'playing'}
        >
          {splitTestMode ? '🔧 Split Test: ON' : '🔧 Split Test: OFF'}
        </button>
        <div className="test-info">
          {splitTestMode
            ? 'Next hand will be splittable (pairs)'
            : 'Click to force splittable hands'
          }
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
