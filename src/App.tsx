import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect, ReactNode } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navigation from './components/Navigation'
import Auth from './components/auth/Auth'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Settings from './pages/Settings'
import SavingsGoals from './pages/SavingsGoals'
import AdminUsers from './pages/admin/AdminUsers'
import AdminUserDetail from './pages/admin/AdminUserDetail'
import TransactionDetail from './pages/TransactionDetail'
import BudgetDetail from './pages/BudgetDetail'
import AdminRoute from './components/routing/AdminRoute'
import './App.css'

interface RouteGuardProps {
  children: ReactNode
}

function ProtectedRoute({ children }: RouteGuardProps) {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function GuestRoute({ children }: RouteGuardProps) {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function UnauthorizedRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/auth', { replace: true })
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [navigate])

  return null
}

function AppRoutes() {
  const { isLoggedIn } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onError = (event: ErrorEvent) => setError(event.message)
    window.addEventListener('error', onError)
    return () => window.removeEventListener('error', onError)
  }, [])

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error</h1>
        <p>{error}</p>
        <p>Check console (F12) for more details</p>
      </div>
    )
  }

  return (
    <div className="app">
      <UnauthorizedRedirect />
      {isLoggedIn && <Navigation />}
      <Routes>
        <Route
          path="/auth"
          element={
            <GuestRoute>
              <Auth />
            </GuestRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/:transactionId"
          element={
            <ProtectedRoute>
              <TransactionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets/:budgetId"
          element={
            <ProtectedRoute>
              <BudgetDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/savings-goals"
          element={
            <ProtectedRoute>
              <SavingsGoals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Navigate to="/admin/users" replace />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <AdminRoute>
              <AdminUserDetail />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? '/' : '/auth'} replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
