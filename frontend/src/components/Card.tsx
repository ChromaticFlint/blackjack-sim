import type { Card as CardType } from '../types/game'

interface CardProps {
  card?: CardType
  isHidden?: boolean
  className?: string
}

export function Card({ card, isHidden = false, className = '' }: CardProps) {
  if (isHidden || !card) {
    return (
      <div className={`card card-back ${className}`}>
        <div className="card-pattern"></div>
      </div>
    )
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds'
  const suitSymbol = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  }[card.suit]

  return (
    <div className={`card card-front ${isRed ? 'red' : 'black'} ${className}`}>
      <div className="card-corner top-left">
        <div className="card-rank">{card.rank}</div>
        <div className="card-suit">{suitSymbol}</div>
      </div>
      
      <div className="card-center">
        <div className="card-suit-large">{suitSymbol}</div>
      </div>
      
      <div className="card-corner bottom-right">
        <div className="card-rank">{card.rank}</div>
        <div className="card-suit">{suitSymbol}</div>
      </div>
    </div>
  )
}
