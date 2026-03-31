import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation: FC = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav>
      <h2>BudgetBuddy</h2>
      <ul>
        <li>
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
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
            to="/settings" 
            className={isActive('/settings') ? 'active' : ''}
          >
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
