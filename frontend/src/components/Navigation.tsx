import { Link, useLocation } from 'react-router-dom'
import { Home, User, Users, Spade } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/single-player', label: 'Single Player', icon: User },
    { path: '/multiplayer', label: 'Multiplayer', icon: Users },
  ]

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Spade className="nav-icon" />
        <span className="nav-title">Blackjack Sim</span>
      </div>
      
      <div className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-link-icon" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
