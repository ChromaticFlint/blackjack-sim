import type { GameState, BlackjackOdds } from '../types/game'

interface GameControlsProps {
  gamePhase: GameState['gamePhase']
  canHit: boolean
  canStand: boolean
  canDoubleDown: boolean
  canSplit: boolean
  onHit: () => void
  onStand: () => void
  onDoubleDown: () => void
  onSplit: () => void
  onNewGame: () => void
  odds?: BlackjackOdds | null
}

export function GameControls({
  gamePhase,
  canHit,
  canStand,
  canDoubleDown,
  canSplit,
  onHit,
  onStand,
  onDoubleDown,
  onSplit,
  onNewGame,
  odds
}: GameControlsProps) {
  const formatPercentage = (value: number) => `${value.toFixed(0)}%` // Value is already a percentage

  // Debug logging for button visibility
  console.log('🎮 GAME CONTROLS RENDER:', {
    gamePhase,
    canHit,
    canStand,
    canDoubleDown,
    canSplit,
    willShowButtons: gamePhase === 'playing'
  })

  if (gamePhase === 'betting') {
    return (
      <div className="game-controls">
        <div className="controls-message">Place your bet to start the game</div>
      </div>
    )
  }

  if (gamePhase === 'dealing') {
    return (
      <div className="game-controls">
        <div className="controls-message">Dealing cards...</div>
      </div>
    )
  }

  if (gamePhase === 'dealer-turn') {
    return (
      <div className="game-controls">
        <div className="controls-message">Dealer is playing...</div>
      </div>
    )
  }

  if (gamePhase === 'game-over') {
    return (
      <div className="game-controls">
        <div className="game-over-message">Game Over</div>
        <button
          className="btn btn-primary new-game-btn"
          onClick={onNewGame}
        >
          New Game
        </button>
      </div>
    )
  }

  // Fallback for unexpected game phases - show New Game button
  if (gamePhase !== 'playing') {
    console.warn('🚨 GameControls: Unexpected game phase:', gamePhase)
    return (
      <div className="game-controls">
        <div className="controls-message">
          {gamePhase === 'betting' ? 'Place your bet to start' :
           gamePhase === 'dealing' ? 'Dealing cards...' :
           gamePhase === 'dealer-turn' ? 'Dealer is playing...' :
           'Unexpected game state'}
        </div>
        {gamePhase !== 'betting' && gamePhase !== 'dealing' && gamePhase !== 'dealer-turn' && (
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

  return (
    <div className="game-controls">
      <div className="action-buttons">
        <div className="action-button-with-odds">
          <button
            className="btn btn-action"
            onClick={onHit}
            disabled={!canHit}
          >
            Hit
          </button>
          {odds && (
            <div className="button-odds">
              {formatPercentage(odds.hitWinProbability)}
            </div>
          )}
        </div>

        <div className="action-button-with-odds">
          <button
            className="btn btn-action"
            onClick={onStand}
            disabled={!canStand}
          >
            Stand
          </button>
          {odds && (
            <div className="button-odds">
              {formatPercentage(odds.standWinProbability)}
            </div>
          )}
        </div>

        <div className="action-button-with-odds">
          <button
            className="btn btn-action"
            onClick={onDoubleDown}
            disabled={!canDoubleDown}
          >
            Double Down
          </button>
          {odds && odds.canDoubleDown && odds.doubleDownWinProbability && (
            <div className="button-odds">
              {formatPercentage(odds.doubleDownWinProbability)}
            </div>
          )}
        </div>

        <div className="action-button-with-odds">
          <button
            className="btn btn-action"
            onClick={onSplit}
            disabled={!canSplit}
          >
            Split
          </button>
          {odds && odds.canSplit && odds.splitWinProbability && (
            <div className="button-odds">
              {formatPercentage(odds.splitWinProbability)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
