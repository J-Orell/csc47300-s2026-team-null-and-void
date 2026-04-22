import { FC, useState } from 'react'
import { 
  Card, 
  PageHeader, 
  Button, 
  FormField,
  Toggle
} from '../components/common'
import '../styles/Settings.css'

const Settings: FC = () => {
  const [settings, setSettings] = useState({
    fullName: 'Raeesah Iram',
    email: 'riram000@citymail.cuny.edu',
    phone: '(212) 555-0199',
    currency: 'USD',
    threshold: 90,
    dateFormat: 'mdy',
    budgetCycleStart: '1',
  })

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    weeklySummary: true,
    transactionAlerts: false,
    monthlyReport: true,
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (field: string, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleToggle = (field: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDiscard = () => {
    setSettings({
      fullName: 'Raeesah Iram',
      email: 'riram000@citymail.cuny.edu',
      phone: '(212) 555-0199',
      currency: 'USD',
      threshold: 90,
      dateFormat: 'mdy',
      budgetCycleStart: '1',
    })
    setNotifications({
      budgetAlerts: true,
      weeklySummary: true,
      transactionAlerts: false,
      monthlyReport: true,
    })
    setSaved(false)
  }

  return (
    <main>
      <div className="settings-container">
        <PageHeader
          title="Settings"
          subtitle="Manage your account preferences and personal information"
        />

        <form onSubmit={e => e.preventDefault()}>
          {/* Personal Information */}
          <Card variant="form" className="settings-section">
            <h2>Personal Information</h2>
            <div className="settings-grid">
              <div className="settings-full-row">
                <FormField
                  label="Full Name"
                  type="text"
                  value={settings.fullName}
                  onChange={(val) => handleChange('fullName', val)}
                />
              </div>

              <FormField
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(val) => handleChange('email', val)}
              />

              <FormField
                label="Phone Number"
                type="tel"
                value={settings.phone}
                onChange={(val) => handleChange('phone', val)}
                placeholder="(212) 555-0199"
              />
            </div>
          </Card>

          {/* Preferences */}
          <Card variant="form" className="settings-section">
            <h2>Preferences</h2>
            <div className="settings-grid">
              <FormField
                label="Local Currency"
                type="select"
                value={settings.currency}
                onChange={(val) => handleChange('currency', val)}
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
                onChange={(val) => handleChange('threshold', Number(val))}
                min="1"
                max="100"
              />

              <FormField
                label="Date Format"
                type="select"
                value={settings.dateFormat}
                onChange={(val) => handleChange('dateFormat', val)}
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
                onChange={(val) => handleChange('budgetCycleStart', val)}
                options={[
                  { value: '1', label: '1st of month' },
                  { value: '15', label: '15th of month' },
                  { value: 'last', label: 'Last day of month' }
                ]}
              />
            </div>
          </Card>

          {/* Notifications */}
          <Card variant="form" className="settings-section">
            <h2>Notifications</h2>
            <div className="notification-options">
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Budget Alerts</span>
                  <span className="toggle-desc">Get notified when spending nears your limit</span>
                </div>
                <Toggle
                  checked={notifications.budgetAlerts}
                  onChange={() => handleToggle('budgetAlerts')}
                />
              </div>

              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Weekly Summary</span>
                  <span className="toggle-desc">Receive a weekly spending report via email</span>
                </div>
                <Toggle
                  checked={notifications.weeklySummary}
                  onChange={() => handleToggle('weeklySummary')}
                />
              </div>

              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Transaction Alerts</span>
                  <span className="toggle-desc">Get notified for every new transaction</span>
                </div>
                <Toggle
                  checked={notifications.transactionAlerts}
                  onChange={() => handleToggle('transactionAlerts')}
                />
              </div>

              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Monthly Report</span>
                  <span className="toggle-desc">Detailed monthly breakdown sent to your email</span>
                </div>
                <Toggle
                  checked={notifications.monthlyReport}
                  onChange={() => handleToggle('monthlyReport')}
                />
              </div>
            </div>
          </Card>

          {/* Payment Methods */}
          <Card variant="form" className="settings-section">
            <h2>Payment Methods</h2>
            <div className="card-list">
              <div className="payment-card-item">
                <div className="payment-card-info">
                  <span className="card-type-badge visa">VISA</span>
                  <span className="payment-card-number">**** **** **** 4242</span>
                </div>
                <div className="payment-card-meta">
                  <span className="payment-card-expiry">Exp: 08/27</span>
                  <button type="button" className="btn-remove-card">Remove</button>
                </div>
              </div>

              <div className="payment-card-item">
                <div className="payment-card-info">
                  <span className="card-type-badge mc">MC</span>
                  <span className="payment-card-number">**** **** **** 8899</span>
                </div>
                <div className="payment-card-meta">
                  <span className="payment-card-expiry">Exp: 03/28</span>
                  <button type="button" className="btn-remove-card">Remove</button>
                </div>
              </div>
            </div>
            <Button variant="primary" className="btn-add-card">+ Add Payment Method</Button>
          </Card>

          {/* Account Management */}
          <Card variant="form" className="settings-section">
            <h2>Account Management</h2>
            <div className="account-actions">
              <Card variant="action">
                <div className="action-info">
                  <span className="action-title">Export Data</span>
                  <span className="action-desc">Download all your transaction data as CSV</span>
                </div>
                <Button variant="primary" size="small" className="btn-action-export">Export</Button>
              </Card>

              <Card variant="action">
                <div className="action-info">
                  <span className="action-title">Pause Account</span>
                  <span className="action-desc">Temporarily disable tracking and notifications</span>
                </div>
                <Button variant="secondary" size="small" className="btn-action-pause">Pause</Button>
              </Card>

              <Card variant="action" className="danger-card">
                <div className="action-info">
                  <span className="action-title">Delete Account</span>
                  <span className="action-desc">Permanently remove your account and all data</span>
                </div>
                <Button variant="danger" size="small">Delete</Button>
              </Card>
            </div>
          </Card>

          {/* Save / Discard Bar */}
          <div className="save-bar">
            <Button variant="primary" onClick={handleSave} size="large" style={{ flex: 2 }}>
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleDiscard} size="large" style={{ flex: 1 }}>
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