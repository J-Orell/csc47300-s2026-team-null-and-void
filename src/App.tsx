import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Settings from './pages/Settings'
import './App.css'

function App() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.addEventListener('error', (event) => {
      setError(event.message)
    })
  }, [])

  if (error) {
    return (
      <div style={{padding: '20px', color: 'red'}}>
        <h1>Error</h1>
        <p>{error}</p>
        <p>Check console (F12) for more details</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
