import { FC, useState, useEffect, useCallback } from 'react'
import { PageHeader, Button, FormField } from '../components/common'
import {
  SettingsSection, NotificationToggle,
  PaymentCard, AccountActionCard
} from '../components/settings'
import { settingsAPI, userAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/mappers'
import { NotificationSettings, UserSettings } from '../types'
import '../styles/Settings.css'

interface PaymentCardUi {
  id: string
  type: 'visa' | 'mc'
  lastFour: string
  expiryDate: string
}

const Settings: FC = () => {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState<UserSettings>({
    fullName: '',
    email: '',
    phone: '',
    currency: 'USD',
    threshold: 90,
    dateFormat: 'mdy',
    budgetCycleStart: '1',
  })
  const [notifications, setNotifications] = useState<NotificationSettings>({
    budgetAlerts: true,
    weeklySummary: false,
    transactionAlerts: true,
    monthlyReport: true,
  })
  const [cards, setCards] = useState<PaymentCardUi[]>([])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadSettings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [settingsRes, profileRes, cardsRes] = await Promise.all([
        settingsAPI.getSettings(),
        userAPI.getProfile(),
        settingsAPI.getPaymentMethods(),
      ])

      const apiSettings = settingsRes.data.settings
      const profile = profileRes.data.user

      setSettings({
        fullName: [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.username,
        email: profile.email,
        phone: '',
        currency: apiSettings.currency || 'USD',
        threshold: 90,
        dateFormat: 'mdy',
        budgetCycleStart: '1',
      })

      setNotifications({
        budgetAlerts: apiSettings.monthlyBudgetReminder ?? true,
        weeklySummary: apiSettings.emailNotifications ?? false,
        transactionAlerts: apiSettings.notificationsEnabled ?? true,
        monthlyReport: apiSettings.savingsGoalReminder ?? true,
      })

      const methods = cardsRes.data.paymentMethods || []
      setCards(
        methods.map((m: { id: string; type: string; lastDigits: string }) => ({
          id: m.id,
          type: m.type === 'credit_card' || m.type === 'visa' ? 'visa' : 'mc',
          lastFour: m.lastDigits,
          expiryDate: '—',
        }))
      )
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load settings'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const nameParts = settings.fullName.trim().split(/\s+/)
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ')

      await userAPI.updateProfile({
        firstName,
        lastName,
        email: settings.email,
      })

      await settingsAPI.updateSettings({
        currency: settings.currency,
        notificationsEnabled: notifications.transactionAlerts,
        emailNotifications: notifications.weeklySummary,
        monthlyBudgetReminder: notifications.budgetAlerts,
        savingsGoalReminder: notifications.monthlyReport,
      })

      const token = localStorage.getItem('authToken')
      if (token && user) {
        login(token, {
          ...user,
          email: settings.email,
          firstName,
          lastName,
        })
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to save settings'))
    } finally {
      setSaving(false)
    }
  }

  const resetSettings = () => {
    loadSettings()
    setSaved(false)
  }

  const removeCard = async (id: string) => {
    try {
      await settingsAPI.deletePaymentMethod(id)
      setCards(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to remove card'))
    }
  }

  const addCard = async () => {
    const name = window.prompt('Card nickname (e.g. Chase Visa)')
    if (!name) return
    const lastDigits = window.prompt('Last 4 digits')
    if (!lastDigits || lastDigits.length !== 4) {
      alert('Enter exactly 4 digits')
      return
    }
    try {
      const res = await settingsAPI.addPaymentMethod({
        type: 'credit_card',
        name,
        lastDigits,
      })
      const method = res.data.paymentMethod
      setCards(prev => [
        ...prev,
        {
          id: method.id,
          type: 'visa',
          lastFour: method.lastDigits,
          expiryDate: '—',
        },
      ])
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to add card'))
    }
  }

  if (loading) {
    return (
      <main>
        <div className="loading">Loading settings...</div>
      </main>
    )
  }

  return (
    <main>
      <div className="settings-container">
        <PageHeader
          title="Settings"
          subtitle="Manage your account preferences and personal information"
        />

        {error && <div className="auth-error-message">{error}</div>}

        <form onSubmit={e => e.preventDefault()}>
          <SettingsSection title="Personal Information">
            <div className="settings-grid">
              <div className="settings-full-row">
                <FormField
                  label="Full Name"
                  type="text"
                  value={settings.fullName}
                  onChange={val => updateSetting('fullName', val)}
                />
              </div>
              <FormField
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={val => updateSetting('email', val)}
              />
              <FormField
                label="Phone Number"
                type="tel"
                value={settings.phone}
                onChange={val => updateSetting('phone', val)}
                placeholder="(optional — not stored on server yet)"
              />
            </div>
          </SettingsSection>

          <SettingsSection title="Preferences">
            <div className="settings-grid">
              <FormField
                label="Local Currency"
                type="select"
                value={settings.currency}
                onChange={val => updateSetting('currency', val)}
                options={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'GBP', label: 'GBP (£)' },
                  { value: 'JPY', label: 'JPY (¥)' },
                  { value: 'CAD', label: 'CAD (C$)' },
                ]}
              />
              <FormField
                label="Spending Alert Threshold (%)"
                type="number"
                value={settings.threshold}
                onChange={val => updateSetting('threshold', Number(val))}
                min="1"
                max="100"
              />
              <FormField
                label="Date Format"
                type="select"
                value={settings.dateFormat}
                onChange={val => updateSetting('dateFormat', val)}
                options={[
                  { value: 'mdy', label: 'MM/DD/YYYY' },
                  { value: 'dmy', label: 'DD/MM/YYYY' },
                  { value: 'ymd', label: 'YYYY-MM-DD' },
                ]}
              />
              <FormField
                label="Budget Cycle Start"
                type="select"
                value={settings.budgetCycleStart}
                onChange={val => updateSetting('budgetCycleStart', val)}
                options={[
                  { value: '1', label: '1st of month' },
                  { value: '15', label: '15th of month' },
                  { value: 'last', label: 'Last day of month' },
                ]}
              />
            </div>
          </SettingsSection>

          <SettingsSection title="Notifications">
            <div className="notification-options">
              <NotificationToggle
                label="Budget Alerts"
                description="Get notified when spending nears your limit"
                checked={notifications.budgetAlerts}
                onChange={() => toggleNotification('budgetAlerts')}
              />
              <NotificationToggle
                label="Weekly Summary"
                description="Receive a weekly spending report via email"
                checked={notifications.weeklySummary}
                onChange={() => toggleNotification('weeklySummary')}
              />
              <NotificationToggle
                label="Transaction Alerts"
                description="Get notified for every new transaction"
                checked={notifications.transactionAlerts}
                onChange={() => toggleNotification('transactionAlerts')}
              />
              <NotificationToggle
                label="Monthly Report"
                description="Detailed monthly breakdown sent to your email"
                checked={notifications.monthlyReport}
                onChange={() => toggleNotification('monthlyReport')}
              />
            </div>
          </SettingsSection>

          <SettingsSection title="Payment Methods">
            <div className="card-list">
              {cards.map(card => (
                <PaymentCard
                  key={card.id}
                  type={card.type}
                  lastFour={card.lastFour}
                  expiryDate={card.expiryDate}
                  onRemove={() => removeCard(card.id)}
                />
              ))}
            </div>
            <Button variant="primary" className="btn-add-card" onClick={addCard}>
              + Add Payment Method
            </Button>
          </SettingsSection>

          <SettingsSection title="Account Management">
            <div className="account-actions">
              <AccountActionCard
                title="Export Data"
                description="Download all your transaction data as CSV"
                actionLabel="Export"
                buttonVariant="primary"
                buttonClassName="btn-action-export"
                onAction={() => alert('Export coming soon')}
              />
              <AccountActionCard
                title="Pause Account"
                description="Temporarily disable tracking and notifications"
                actionLabel="Pause"
                buttonVariant="secondary"
                buttonClassName="btn-action-pause"
                onAction={() => alert('Pause coming soon')}
              />
              <AccountActionCard
                title="Delete Account"
                description="Permanently remove your account and all data"
                actionLabel="Delete"
                variant="danger"
                buttonVariant="danger"
                onAction={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to delete your account? This cannot be undone.'
                    )
                  ) {
                    alert('Contact admin to delete account')
                  }
                }}
              />
            </div>
          </SettingsSection>

          <div className="save-bar">
            <Button variant="primary" onClick={saveSettings} size="large" loading={saving}>
              Save Changes
            </Button>
            <Button variant="secondary" onClick={resetSettings} size="large">
              Discard
            </Button>
          </div>

          {saved && (
            <div className="save-success">✓ Settings saved successfully!</div>
          )}
        </form>
      </div>
    </main>
  )
}

export default Settings
