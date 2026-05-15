import { FC } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navigation: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/' || location.pathname === '/dashboard'
      : location.pathname === path || location.pathname.startsWith(`${path}/`)

  const handleLogout = () => {
    logout()
    navigate('/auth', { replace: true })
  }

  return (
    <nav>
      <h2>BudgetBuddy</h2>
      <ul>
        <li>
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/transactions" 
            className={isActive('/transactions') ? 'active' : ''}
          >
            Transactions
          </Link>
        </li>
        <li>
          <Link 
            to="/budget" 
            className={isActive('/budget') ? 'active' : ''}
          >
            Budget
          </Link>
        </li>
        <li>
          <Link 
            to="/savings-goals" 
            className={isActive('/savings-goals') ? 'active' : ''}
          >
            Savings Goals
          </Link>
        </li>
        <li>
          <Link 
            to="/settings" 
            className={isActive('/settings') ? 'active' : ''}
          >
            Settings
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link
              to="/admin/users"
              className={isActive('/admin') ? 'active' : ''}
            >
              Admin
            </Link>
          </li>
        )}
      </ul>
      <div className="nav-user-section">
        {user && (
          <div className="nav-user-info">
            <span className="nav-user-name">{user.firstName} {user.lastName}</span>
            <span className="nav-user-email">{user.email}</span>
          </div>
        )}
        <button className="nav-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navigation
