import { FC, useState } from 'react'
import Login from './Login'
import Register from './Register'
import './Auth.css'

const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content-wrapper">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <div className="auth-branding-content">
              <div className="auth-logo">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7V12C2 16.5264 6.47715 20.5 12 20.5C17.5228 20.5 22 16.5264 22 12V7L12 2Z" />
                  <path d="M12 12V16" />
                  <path d="M9 14H15" />
                </svg>
              </div>
              <h1>BudgetBuddy</h1>
              <p className="auth-tagline">Your Personal Finance Manager</p>

              <div className="auth-features">
                <div className="auth-feature">
                  <div className="auth-feature-icon">✓</div>
                  <h3>Track Expenses</h3>
                  <p>Monitor every transaction in real-time</p>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon">✓</div>
                  <h3>Set Budgets</h3>
                  <p>Plan your spending with category budgets</p>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon">✓</div>
                  <h3>Reach Goals</h3>
                  <p>Track savings goals and milestones</p>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon">✓</div>
                  <h3>Visualize</h3>
                  <p>See spending patterns with charts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-side">
            <div className="auth-form-wrapper">
              {isLogin ? (
                <Login onSwitchToRegister={() => setIsLogin(false)} />
              ) : (
                <Register onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
