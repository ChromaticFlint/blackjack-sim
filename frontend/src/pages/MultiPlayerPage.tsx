import { useState } from 'react'
import { Users, Wifi, WifiOff } from 'lucide-react'

export function MultiPlayerPage() {
  const [isConnected, _setIsConnected] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')

  return (
    <div className="multiplayer-page">
      <div className="multiplayer-container">
        <div className="multiplayer-header">
          <h1>
            <Users className="page-icon" />
            Multiplayer Blackjack
          </h1>
          <p className="page-subtitle">
            Play with up to 4 friends in real-time multiplayer sessions
          </p>
        </div>

        <div className="connection-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? <Wifi className="status-icon" /> : <WifiOff className="status-icon" />}
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {!isConnected ? (
          <div className="connection-panel">
            <div className="connection-options">
              <div className="option-card">
                <h3>Create Room</h3>
                <p>Start a new game and invite friends</p>
                <div className="form-group">
                  <label htmlFor="player-name">Your Name:</label>
                  <input
                    id="player-name"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                  />
                </div>
                <button 
                  className="btn btn-primary"
                  disabled={!playerName.trim()}
                >
                  Create Room
                </button>
              </div>

              <div className="option-divider">
                <span>OR</span>
              </div>

              <div className="option-card">
                <h3>Join Room</h3>
                <p>Enter a room code to join an existing game</p>
                <div className="form-group">
                  <label htmlFor="player-name-join">Your Name:</label>
                  <input
                    id="player-name-join"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="room-code">Room Code:</label>
                  <input
                    id="room-code"
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter room code"
                    maxLength={6}
                  />
                </div>
                <button 
                  className="btn btn-secondary"
                  disabled={!playerName.trim() || !roomCode.trim()}
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="game-room">
            <div className="room-info">
              <h3>Room: {roomCode}</h3>
              <p>Share this code with friends to join</p>
            </div>

            <div className="players-list">
              <h4>Players (1/4)</h4>
              <div className="player-item">
                <div className="player-avatar">👤</div>
                <div className="player-details">
                  <div className="player-name">{playerName}</div>
                  <div className="player-status">Ready</div>
                </div>
              </div>
            </div>

            <div className="room-actions">
              <button className="btn btn-primary">Start Game</button>
              <button className="btn btn-secondary">Leave Room</button>
            </div>
          </div>
        )}

        <div className="multiplayer-info">
          <h3>How Multiplayer Works</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>🎮 Real-time Play</h4>
              <p>All players make decisions simultaneously with live updates</p>
            </div>
            <div className="info-item">
              <h4>📊 Shared Odds</h4>
              <p>See probability calculations for all players at the table</p>
            </div>
            <div className="info-item">
              <h4>💬 Chat System</h4>
              <p>Communicate with other players during the game</p>
            </div>
            <div className="info-item">
              <h4>🏆 Leaderboard</h4>
              <p>Track wins and losses across multiple games</p>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <div className="coming-soon-content">
            <h3>🚧 Coming Soon</h3>
            <p>
              Multiplayer functionality is currently in development. 
              For now, enjoy the single-player mode with full odds calculation and strategy recommendations.
            </p>
            <p>
              Planned features include WebSocket-based real-time gameplay, 
              voice chat integration, and tournament modes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
