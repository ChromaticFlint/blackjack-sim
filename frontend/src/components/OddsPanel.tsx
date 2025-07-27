import type { BlackjackOdds, Hand, Card } from '../types/game'
import { BlackjackEngine } from '../utils/gameEngine'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'

interface OddsPanelProps {
  odds: BlackjackOdds
  playerHand: Hand
  dealerUpCard: Card
  showStrategy: boolean
  onToggleStrategy: () => void
}

export function OddsPanel({
  odds,
  playerHand,
  dealerUpCard,
  showStrategy,
  onToggleStrategy
}: OddsPanelProps) {
  const strategyAction = BlackjackEngine.getBasicStrategyAction(playerHand, dealerUpCard)

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`

  return (
    <div className="odds-panel">
      <div className="panel-header">
        <h3>
          <TrendingUp className="panel-icon" />
          Odds & Strategy
        </h3>
        <button
          className="toggle-strategy-btn"
          onClick={onToggleStrategy}
          title={showStrategy ? 'Hide strategy' : 'Show strategy'}
        >
          {showStrategy ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="odds-section">
        <h4>Win Probabilities</h4>
        <div className="odds-grid">
          <div className="odds-item">
            <span className="odds-label">Hit:</span>
            <span className="odds-value hit">{formatPercentage(odds.hitWinProbability)}</span>
          </div>
          <div className="odds-item">
            <span className="odds-label">Stand:</span>
            <span className="odds-value stand">{formatPercentage(odds.standWinProbability)}</span>
          </div>
          {odds.canDoubleDown && odds.doubleDownWinProbability && (
            <div className="odds-item">
              <span className="odds-label">Double:</span>
              <span className="odds-value double">{formatPercentage(odds.doubleDownWinProbability)}</span>
            </div>
          )}
          {odds.canSplit && odds.splitWinProbability && (
            <div className="odds-item">
              <span className="odds-label">Split:</span>
              <span className="odds-value split">{formatPercentage(odds.splitWinProbability)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="risk-section">
        <h4>Risk Analysis</h4>
        <div className="risk-grid">
          <div className="risk-item">
            <span className="risk-label">Bust if Hit:</span>
            <span className="risk-value bust">{formatPercentage(odds.bustProbability)}</span>
          </div>
          <div className="risk-item">
            <span className="risk-label">Dealer Bust:</span>
            <span className="risk-value dealer-bust">{formatPercentage(odds.dealerBustProbability)}</span>
          </div>
        </div>
      </div>

      {showStrategy && (
        <div className="strategy-section">
          <h4>Basic Strategy</h4>
          <div className="strategy-recommendation">
            <div className="strategy-action">{strategyAction}</div>
            <div className="strategy-explanation">
              Based on your hand ({playerHand.value}) vs dealer's {dealerUpCard.rank}
            </div>
          </div>
        </div>
      )}

      <div className="hand-analysis">
        <h4>Hand Analysis</h4>
        <div className="analysis-grid">
          <div className="analysis-item">
            <span className="analysis-label">Hand Type:</span>
            <span className="analysis-value">
              {playerHand.isSoft ? 'Soft' : 'Hard'} {playerHand.value}
            </span>
          </div>
          <div className="analysis-item">
            <span className="analysis-label">Can Double:</span>
            <span className="analysis-value">{odds.canDoubleDown ? 'Yes' : 'No'}</span>
          </div>
          <div className="analysis-item">
            <span className="analysis-label">Can Split:</span>
            <span className="analysis-value">{odds.canSplit ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
