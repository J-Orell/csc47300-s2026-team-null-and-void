import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import FormField from '../common/FormField'
import { userAPI } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

const Register: FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validation
      if (!formData.username || !formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      const response = await userAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      })

      const { token, user } = response.data
      login(token, user)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2>Create Account</h2>
        <p>Join BudgetBuddy and start managing your finances</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error-message">{error}</div>}

        <div className="auth-form-row">
          <FormField
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={value => handleChange('firstName', value)}
            placeholder="Enter first name"
            required
            className="auth-form-half"
          />
          <FormField
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={value => handleChange('lastName', value)}
            placeholder="Enter last name"
            required
            className="auth-form-half"
          />
        </div>

        <FormField
          label="Username"
          type="text"
          value={formData.username}
          onChange={value => handleChange('username', value)}
          placeholder="Choose a username"
          required
        />

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
          placeholder="Create a password (min 6 characters)"
          required
        />

        <FormField
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={value => handleChange('confirmPassword', value)}
          placeholder="Confirm your password"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="auth-form-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="auth-switch-link"
            onClick={onSwitchToLogin}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register
