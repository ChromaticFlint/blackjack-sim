import type { BlackjackOdds, Hand, Card } from '../types/game'
import { BlackjackEngine } from '../utils/gameEngine'
import { TrendingUp } from 'lucide-react'

interface OddsCheatSheetProps {
  odds: BlackjackOdds
  playerHand: Hand
  dealerUpCard: Card
}

export function OddsCheatSheet({
  odds,
  playerHand,
  dealerUpCard
}: OddsCheatSheetProps) {
  const strategyAction = BlackjackEngine.getBasicStrategyAction(playerHand, dealerUpCard)
  const formatPercentage = (value: number) => `${value.toFixed(0)}%` // Value is already a percentage

  return (
    <div className="odds-cheat-sheet">
      <h3>
        <TrendingUp size={16} />
        Odds & Strategy
      </h3>

      <div className="odds-compact">
        <div className="odds-section-compact">
          <h4>Win Chances</h4>
          <div className="odds-grid-compact">
            <div className="odds-item-compact">
              <span className="odds-label-compact">Hit:</span>
              <span className="odds-value-compact hit">{formatPercentage(odds.hitWinProbability)}</span>
            </div>
            <div className="odds-item-compact">
              <span className="odds-label-compact">Stand:</span>
              <span className="odds-value-compact stand">{formatPercentage(odds.standWinProbability)}</span>
            </div>
            {odds.canDoubleDown && odds.doubleDownWinProbability && (
              <div className="odds-item-compact">
                <span className="odds-label-compact">Double:</span>
                <span className="odds-value-compact double">{formatPercentage(odds.doubleDownWinProbability)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="odds-section-compact">
          <h4>Risk</h4>
          <div className="odds-grid-compact">
            <div className="odds-item-compact">
              <span className="odds-label-compact">Bust Risk:</span>
              <span className="odds-value-compact bust">{formatPercentage(odds.bustProbability)}</span>
            </div>
            <div className="odds-item-compact">
              <span className="odds-label-compact">Dealer Bust:</span>
              <span className="odds-value-compact dealer-bust">{formatPercentage(odds.dealerBustProbability)}</span>
            </div>
          </div>
        </div>

        <div className="strategy-compact">
          <div className="strategy-action-compact">{strategyAction}</div>
          <div className="strategy-explanation-compact">
            {playerHand.value} vs {dealerUpCard.rank}
          </div>
        </div>

        <div className="odds-section-compact">
          <h4>Hand Info</h4>
          <div className="odds-grid-compact">
            <div className="odds-item-compact">
              <span className="odds-label-compact">Type:</span>
              <span className="odds-value-compact">
                {playerHand.isSoft ? 'Soft' : 'Hard'} {playerHand.value}
              </span>
            </div>
            <div className="odds-item-compact">
              <span className="odds-label-compact">Double:</span>
              <span className="odds-value-compact">{odds.canDoubleDown ? 'Yes' : 'No'}</span>
            </div>
            <div className="odds-item-compact">
              <span className="odds-label-compact">Split:</span>
              <span className="odds-value-compact">{odds.canSplit ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
