interface GameMessagePanelProps {
  message: string
  gamePhase: string
}

export function GameMessagePanel({ message, gamePhase }: GameMessagePanelProps) {
  // Determine message type for styling
  const getMessageType = (msg: string): string => {
    if (!msg) return 'default'
    
    const lowerMsg = msg.toLowerCase()
    
    if (lowerMsg.includes('win') || lowerMsg.includes('blackjack')) {
      return 'win'
    }
    if (lowerMsg.includes('lose') || lowerMsg.includes('bust')) {
      return 'lose'
    }
    if (lowerMsg.includes('push') || lowerMsg.includes('tie')) {
      return 'push'
    }
    if (lowerMsg.includes('split')) {
      // Determine split result type based on emojis/content
      if (lowerMsg.includes('🎉') || (lowerMsg.includes('+$') && !lowerMsg.includes('-$'))) {
        return 'split-win'
      }
      if (lowerMsg.includes('💸') || (lowerMsg.includes('-$') && !lowerMsg.includes('+$'))) {
        return 'split-lose'
      }
      if (lowerMsg.includes('🤝')) {
        return 'split-push'
      }
      return 'split'
    }
    if (lowerMsg.includes('auto-play')) {
      return 'auto-play'
    }
    
    return 'info'
  }

  const messageType = getMessageType(message)

  return (
    <div className="panel-section game-status">
      <div className="message-panel-header">
        <h3 className="panel-title">Game Status</h3>
      </div>
      
      <div className="message-panel-content">
        {message ? (
          <div className={`game-message-display ${messageType}`}>
            {message}
          </div>
        ) : (
          <div className="game-message-placeholder">
            {gamePhase === 'betting' && 'Place your bet to start'}
            {gamePhase === 'dealing' && 'Dealing cards...'}
            {gamePhase === 'playing' && 'Make your move'}
            {gamePhase === 'dealer-turn' && 'Dealer is playing...'}
            {gamePhase === 'game-over' && 'Game complete'}
          </div>
        )}
      </div>
    </div>
  )
}
