import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { HomePage } from './pages/HomePage'
import { SinglePlayerPage } from './pages/SinglePlayerPage'
import { MultiPlayerPage } from './pages/MultiPlayerPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/single-player" element={<SinglePlayerPage />} />
            <Route path="/multiplayer" element={<MultiPlayerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
