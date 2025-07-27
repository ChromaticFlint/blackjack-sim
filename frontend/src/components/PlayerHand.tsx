import type { Player } from '../types/game'
import { Card } from './Card'

interface PlayerHandProps {
  player: Player
  isActive: boolean
}

export function PlayerHand({ player, isActive }: PlayerHandProps) {
  // Check if player has split hands
  const hasSplitHands = player.splitHands && player.splitHands.length > 0;
  const currentHandIndex = player.currentHandIndex ?? 0;

  if (hasSplitHands) {
    // Display split hands
    return (
      <div className={`player-hand ${isActive ? 'active' : ''}`}>
        <div className="player-info">
          <div className="player-name">{player.name}</div>
          <div className="split-hands-header">
            <span className="split-indicator">SPLIT HANDS</span>
            <span className="current-hand-indicator">
              Playing Hand {currentHandIndex + 1} of {player.splitHands?.length || 0}
            </span>
          </div>
        </div>

        <div className="split-hands-container">
          {player.splitHands?.map((hand, index) => (
            <div
              key={`split-hand-${index}`}
              className={`split-hand ${index === currentHandIndex ? 'current-hand' : 'waiting-hand'}`}
            >
              <div className="split-hand-header">
                <span className="hand-number">Hand {index + 1}</span>
                <span className="hand-value">
                  {hand.value}
                  {hand.isSoft && hand.value !== 21 && ' (soft)'}
                </span>
                <span className="bet-amount">${player.bet}</span>
              </div>

              {hand.isBlackjack && (
                <div className="hand-status blackjack">BLACKJACK!</div>
              )}
              {hand.isBusted && (
                <div className="hand-status busted">BUSTED!</div>
              )}

              <div className="cards-container">
                {hand.cards.map((card, cardIndex) => (
                  <Card
                    key={`${card.suit}-${card.rank}-${index}-${cardIndex}`}
                    card={card}
                    className={`card-${cardIndex} ${index === currentHandIndex ? 'current' : 'waiting'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="chips-display">
          <span className="chips-label">Chips:</span>
          <span className="chips-amount">${player.chips}</span>
        </div>
      </div>
    )
  }

  // Display regular single hand
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
