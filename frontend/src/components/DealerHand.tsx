import type { Hand } from '../types/game'
import { Card } from './Card'

interface DealerHandProps {
  hand: Hand
  hideSecondCard?: boolean
}

export function DealerHand({ hand, hideSecondCard = false }: DealerHandProps) {
  const visibleCards = hideSecondCard ? hand.cards.slice(0, 1) : hand.cards
  const visibleValue = hideSecondCard && hand.cards.length > 1 
    ? hand.cards[0].value 
    : hand.value

  return (
    <div className="dealer-hand">
      <div className="dealer-info">
        <div className="dealer-name">Dealer</div>
        <div className="dealer-stats">
          <span className="hand-value">
            {hideSecondCard && hand.cards.length > 1 ? `${visibleValue} + ?` : visibleValue}
            {!hideSecondCard && hand.isSoft && hand.value !== 21 && ' (soft)'}
          </span>
        </div>
        {!hideSecondCard && hand.isBlackjack && (
          <div className="hand-status blackjack">BLACKJACK!</div>
        )}
        {!hideSecondCard && hand.isBusted && (
          <div className="hand-status busted">BUSTED!</div>
        )}
      </div>
      
      <div className="cards-container">
        {visibleCards.map((card, index) => (
          <Card
            key={`${card.suit}-${card.rank}-${index}`}
            card={card}
            className={`card-${index}`}
          />
        ))}
        {hideSecondCard && hand.cards.length > 1 && (
          <Card
            isHidden={true}
            className="card-1"
          />
        )}
      </div>
    </div>
  )
}
