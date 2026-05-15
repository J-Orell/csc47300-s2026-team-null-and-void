import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import FormField from '../common/FormField'
import { userAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

interface LoginFormData {
  email: string
  password: string
}

const Login: FC<{ onSwitchToRegister: () => void }> = ({ onSwitchToRegister }) => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      const response = await userAPI.login({
        email: formData.email,
        password: formData.password,
      })

      const { token, user } = response.data
      login(token, user)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your BudgetBuddy account</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error-message">{error}</div>}

        <FormField
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={value => handleChange('email', value)}
          placeholder="Enter your email"
          required
        />

        <FormField
          label="Password"
          type="password"
          value={formData.password}
          onChange={value => handleChange('password', value)}
          placeholder="Enter your password"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="auth-form-footer">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="auth-switch-link"
            onClick={onSwitchToRegister}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
