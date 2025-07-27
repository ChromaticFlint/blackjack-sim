import type { Player } from '../types/game'
import { Card } from './Card'

interface PlayerHandProps {
  player: Player
  isActive: boolean
}

export function PlayerHand({ player, isActive }: PlayerHandProps) {
  return (
    <div className={`player-hand ${isActive ? 'active' : ''}`}>
      <div className="player-info">
        <div className="player-name">{player.name}</div>
        <div className="player-stats">
          <span className="hand-value">
            {player.hand.value}
            {player.hand.isSoft && player.hand.value !== 21 && ' (soft)'}
          </span>
          {player.bet > 0 && (
            <span className="bet-amount">${player.bet}</span>
          )}
        </div>
        {player.hand.isBlackjack && (
          <div className="hand-status blackjack">BLACKJACK!</div>
        )}
        {player.hand.isBusted && (
          <div className="hand-status busted">BUSTED!</div>
        )}
      </div>
      
      <div className="cards-container">
        {player.hand.cards.map((card, index) => (
          <Card
            key={`${card.suit}-${card.rank}-${index}`}
            card={card}
            className={`card-${index}`}
          />
        ))}
      </div>
      
      <div className="chips-display">
        <span className="chips-label">Chips:</span>
        <span className="chips-amount">${player.chips}</span>
      </div>
    </div>
  )
}
