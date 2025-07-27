import { Link } from 'react-router-dom'
import { Play, Users, TrendingUp, Target } from 'lucide-react'

export function HomePage() {
  const basicStrategyChart = [
    { hand: 'Hard 20-21', action: 'Stand', description: 'Always stand with 20 or 21' },
    { hand: 'Hard 17-19', action: 'Stand', description: 'Stand on all 17s and higher' },
    { hand: 'Hard 13-16', action: 'Stand vs 2-6, Hit vs 7-A', description: 'Dealer likely to bust with low cards' },
    { hand: 'Hard 12', action: 'Stand vs 4-6, Hit vs 2-3,7-A', description: 'Marginal hand, depends on dealer up card' },
    { hand: 'Hard 11', action: 'Double if possible, else Hit', description: 'Great doubling opportunity' },
    { hand: 'Hard 10', action: 'Double vs 2-9, Hit vs 10-A', description: 'Strong doubling hand' },
    { hand: 'Hard 9', action: 'Double vs 3-6, Hit otherwise', description: 'Double against weak dealer cards' },
    { hand: 'Hard 5-8', action: 'Hit', description: 'Cannot bust, always take a card' },
  ]

  const softHandStrategy = [
    { hand: 'Soft 20-21', action: 'Stand', description: 'Excellent hands' },
    { hand: 'Soft 19', action: 'Stand', description: 'Strong hand, no improvement needed' },
    { hand: 'Soft 18', action: 'Double vs 3-6, Stand vs 2,7,8, Hit vs 9,10,A', description: 'Flexible hand' },
    { hand: 'Soft 17', action: 'Double vs 3-6, Hit otherwise', description: 'Room for improvement' },
    { hand: 'Soft 13-16', action: 'Double vs 5-6, Hit otherwise', description: 'Weak hands needing help' },
  ]

  const pairStrategy = [
    { hand: 'A-A, 8-8', action: 'Always Split', description: 'Best splitting opportunities' },
    { hand: '10-10, 5-5', action: 'Never Split', description: 'Too strong (10s) or better to double (5s)' },
    { hand: '9-9', action: 'Split vs 2-9 except 7, Stand vs 7,10,A', description: 'Strong pair with exceptions' },
    { hand: '7-7, 6-6, 3-3, 2-2', action: 'Split vs 2-7, Hit vs 8-A', description: 'Split against weak dealer cards' },
    { hand: '4-4', action: 'Hit', description: 'Better as 8 than two weak hands' },
  ]

  const gameStats = [
    { stat: 'House Edge (Basic Strategy)', value: '0.5%', description: 'With perfect basic strategy' },
    { stat: 'House Edge (Average Player)', value: '2-3%', description: 'Typical recreational player' },
    { stat: 'Blackjack Probability', value: '4.8%', description: 'Chance of natural blackjack' },
    { stat: 'Dealer Bust Rate', value: '28.3%', description: 'Dealer busts on average' },
    { stat: 'Player Bust Rate', value: '16%', description: 'With basic strategy' },
    { stat: 'Push Rate', value: '8.5%', description: 'Ties with dealer' },
  ]

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Blackjack Simulator</span>
          </h1>
          <p className="hero-subtitle">
            Master the game with perfect strategy, real-time odds, and professional-grade simulation
          </p>
          
          <div className="hero-actions">
            <Link to="/single-player" className="btn btn-primary">
              <Play className="btn-icon" />
              Play Solo
            </Link>
            <Link to="/multiplayer" className="btn btn-secondary">
              <Users className="btn-icon" />
              Multiplayer
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Game Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <TrendingUp className="feature-icon" />
              <h3>Real-time Odds</h3>
              <p>See your probability of winning with every decision. Learn optimal play through data.</p>
            </div>
            <div className="feature-card">
              <Target className="feature-icon" />
              <h3>Perfect Strategy</h3>
              <p>Built-in basic strategy recommendations help you make the mathematically correct choice.</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>Multiplayer Mode</h3>
              <p>Play with up to 4 friends in real-time multiplayer sessions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rules">
        <div className="container">
          <h2 className="section-title">Blackjack Rules</h2>
          <div className="rules-content">
            <div className="rules-basic">
              <h3>Basic Rules</h3>
              <ul>
                <li><strong>Objective:</strong> Get as close to 21 as possible without going over</li>
                <li><strong>Card Values:</strong> Face cards = 10, Aces = 1 or 11, Number cards = face value</li>
                <li><strong>Blackjack:</strong> Ace + 10-value card on first two cards (pays 3:2)</li>
                <li><strong>Dealer Rules:</strong> Must hit on 16 or less, must stand on 17 or more</li>
                <li><strong>Winning:</strong> Beat dealer without busting, or dealer busts</li>
              </ul>
            </div>
            
            <div className="rules-actions">
              <h3>Player Actions</h3>
              <ul>
                <li><strong>Hit:</strong> Take another card</li>
                <li><strong>Stand:</strong> Keep current total</li>
                <li><strong>Double Down:</strong> Double bet, take exactly one more card</li>
                <li><strong>Split:</strong> Split pairs into two separate hands</li>
                <li><strong>Surrender:</strong> Forfeit half your bet (if available)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="statistics">
        <div className="container">
          <h2 className="section-title">Game Statistics</h2>
          <div className="stats-grid">
            {gameStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-name">{stat.stat}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="strategy">
        <div className="container">
          <h2 className="section-title">Basic Strategy Guide</h2>
          
          <div className="strategy-section">
            <h3>Hard Hands (No Ace or Ace counted as 1)</h3>
            <div className="strategy-table">
              {basicStrategyChart.map((row, index) => (
                <div key={index} className="strategy-row">
                  <div className="strategy-hand">{row.hand}</div>
                  <div className="strategy-action">{row.action}</div>
                  <div className="strategy-description">{row.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="strategy-section">
            <h3>Soft Hands (Ace counted as 11)</h3>
            <div className="strategy-table">
              {softHandStrategy.map((row, index) => (
                <div key={index} className="strategy-row">
                  <div className="strategy-hand">{row.hand}</div>
                  <div className="strategy-action">{row.action}</div>
                  <div className="strategy-description">{row.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="strategy-section">
            <h3>Pairs</h3>
            <div className="strategy-table">
              {pairStrategy.map((row, index) => (
                <div key={index} className="strategy-row">
                  <div className="strategy-hand">{row.hand}</div>
                  <div className="strategy-action">{row.action}</div>
                  <div className="strategy-description">{row.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="strategy-note">
            <p><strong>Note:</strong> This basic strategy assumes standard rules (dealer stands on soft 17, double after split allowed, surrender not available). Adjust strategy based on specific house rules.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
