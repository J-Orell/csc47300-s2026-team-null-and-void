import { FC, useState, useEffect } from 'react'
import { PageHeader, Button, FormField } from '../components/common'
import {
  SettingsSection, NotificationToggle,
  PaymentCard, AccountActionCard
} from '../components/settings'
import { useDataFetch, usePaymentCards } from '../hooks'
import { SettingsData, UserSettings, NotificationSettings } from '../types'
import '../styles/Settings.css'

const Settings: FC = () => {
  const { data: fetchedData, loading } = useDataFetch<SettingsData>('/data/settings-data.json')
  
  const [settings, setSettings] = useState<UserSettings>({
    fullName: '',
    email: '',
    phone: '',
    currency: 'USD',
    threshold: 90,
    dateFormat: 'mdy',
    budgetCycleStart: '1'
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    budgetAlerts: true,
    weeklySummary: false,
    transactionAlerts: true,
    monthlyReport: true
  })

  const [saved, setSaved] = useState(false)
  const { cards, removeCard } = usePaymentCards()

  // Initialize state when data is fetched
  useEffect(() => {
    if (fetchedData) {
      setSettings(fetchedData.userSettings)
      setNotifications(fetchedData.notifications)
    }
  }, [fetchedData])

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const saveSettings = () => {
    console.log('Saving settings:', { settings, notifications })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const resetSettings = () => {
    if (fetchedData) {
      setSettings(fetchedData.userSettings)
      setNotifications(fetchedData.notifications)
      setSaved(false)
    }
  }

  if (loading) return <main><div className="loading">Loading settings...</div></main>

  return (
    <main>
      <div className="settings-container">
        <PageHeader
          title="Settings"
          subtitle="Manage your account preferences and personal information"
        />

        <form onSubmit={e => e.preventDefault()}>
          {/* Personal Information */}
          <SettingsSection title="Personal Information">
            <div className="settings-grid">
              <div className="settings-full-row">
                <FormField
                  label="Full Name"
                  type="text"
                  value={settings.fullName}
                  onChange={(val) => updateSetting('fullName', val)}
                />
              </div>
              <FormField
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(val) => updateSetting('email', val)}
              />
              <FormField
                label="Phone Number"
                type="tel"
                value={settings.phone}
                onChange={(val) => updateSetting('phone', val)}
                placeholder="(212) 555-0199"
              />
            </div>
          </SettingsSection>

          {/* Preferences */}
          <SettingsSection title="Preferences">
            <div className="settings-grid">
              <FormField
                label="Local Currency"
                type="select"
                value={settings.currency}
                onChange={(val) => updateSetting('currency', val)}
                options={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'GBP', label: 'GBP (£)' },
                  { value: 'JPY', label: 'JPY (¥)' },
                  { value: 'CAD', label: 'CAD (C$)' }
                ]}
              />
              <FormField
                label="Spending Alert Threshold (%)"
                type="number"
                value={settings.threshold}
                onChange={(val) => updateSetting('threshold', Number(val))}
                min="1"
                max="100"
              />
              <FormField
                label="Date Format"
                type="select"
                value={settings.dateFormat}
                onChange={(val) => updateSetting('dateFormat', val)}
                options={[
                  { value: 'mdy', label: 'MM/DD/YYYY' },
                  { value: 'dmy', label: 'DD/MM/YYYY' },
                  { value: 'ymd', label: 'YYYY-MM-DD' }
                ]}
              />
              <FormField
                label="Budget Cycle Start"
                type="select"
                value={settings.budgetCycleStart}
                onChange={(val) => updateSetting('budgetCycleStart', val)}
                options={[
                  { value: '1', label: '1st of month' },
                  { value: '15', label: '15th of month' },
                  { value: 'last', label: 'Last day of month' }
                ]}
              />
            </div>
          </SettingsSection>

          {/* Notifications */}
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

          {/* Payment Methods */}
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
            <Button variant="primary" className="btn-add-card">
              + Add Payment Method
            </Button>
          </SettingsSection>

          {/* Account Management */}
          <SettingsSection title="Account Management">
            <div className="account-actions">
              <AccountActionCard
                title="Export Data"
                description="Download all your transaction data as CSV"
                actionLabel="Export"
                buttonVariant="primary"
                buttonClassName="btn-action-export"
                onAction={() => alert('Exporting data...')}
              />
              <AccountActionCard
                title="Pause Account"
                description="Temporarily disable tracking and notifications"
                actionLabel="Pause"
                buttonVariant="secondary"
                buttonClassName="btn-action-pause"
                onAction={() => alert('Pausing account...')}
              />
              <AccountActionCard
                title="Delete Account"
                description="Permanently remove your account and all data"
                actionLabel="Delete"
                variant="danger"
                buttonVariant="danger"
                onAction={() => {
                  if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                    alert('Account deleted')
                  }
                }}
              />
            </div>
          </SettingsSection>

          {/* Save / Discard Bar */}
          <div className="save-bar">
            <Button variant="primary" onClick={saveSettings} size="large">
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