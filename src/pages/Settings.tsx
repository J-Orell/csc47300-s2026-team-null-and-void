import { FC, useState } from 'react'
import '../styles/Settings.css'

const Settings: FC = () => {
  const [settings, setSettings] = useState({
    fullName:         'Raeesah Iram',
    email:            'riram000@citymail.cuny.edu',
    phone:            '(212) 555-0199',
    currency:         'USD',
    threshold:        90,
    dateFormat:       'mdy',
    budgetCycleStart: '1',
  })

  const [notifications, setNotifications] = useState({
    budgetAlerts:       true,
    weeklySummary:      true,
    transactionAlerts:  false,
    monthlyReport:      true,
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
      fullName:         'Raeesah Iram',
      email:            'riram000@citymail.cuny.edu',
      phone:            '(212) 555-0199',
      currency:         'USD',
      threshold:        90,
      dateFormat:       'mdy',
      budgetCycleStart: '1',
    })
    setNotifications({
      budgetAlerts:      true,
      weeklySummary:     true,
      transactionAlerts: false,
      monthlyReport:     true,
    })
    setSaved(false)
  }

  return (
    <main>
      <div className="settings-container">
        <header>
          <h1>Settings</h1>
          <p>Manage your account preferences and personal information</p>
        </header>

        <form onSubmit={e => e.preventDefault()}>

          {/* ── Personal Information ── */}
          <section className="settings-section">
            <h2>Personal Information</h2>
            <div className="settings-grid">
              <div className="settings-field settings-full-row">
                <label>Full Name</label>
                <input
                  type="text"
                  value={settings.fullName}
                  onChange={e => handleChange('fullName', e.target.value)}
                />
              </div>
              <div className="settings-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
              </div>
              <div className="settings-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="(212) 555-0199"
                  value={settings.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ── Preferences ── */}
          <section className="settings-section">
            <h2>Preferences</h2>
            <div className="settings-grid">
              <div className="settings-field">
                <label>Local Currency</label>
                <select
                  value={settings.currency}
                  onChange={e => handleChange('currency', e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
              <div className="settings-field">
                <label>Spending Alert Threshold (%)</label>
                <input
                  type="number" min="1" max="100"
                  value={settings.threshold}
                  onChange={e => handleChange('threshold', Number(e.target.value))}
                />
              </div>
              <div className="settings-field">
                <label>Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={e => handleChange('dateFormat', e.target.value)}
                >
                  <option value="mdy">MM/DD/YYYY</option>
                  <option value="dmy">DD/MM/YYYY</option>
                  <option value="ymd">YYYY-MM-DD</option>
                </select>
              </div>
              <div className="settings-field">
                <label>Budget Cycle Start</label>
                <select
                  value={settings.budgetCycleStart}
                  onChange={e => handleChange('budgetCycleStart', e.target.value)}
                >
                  <option value="1">1st of month</option>
                  <option value="15">15th of month</option>
                  <option value="last">Last day of month</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Notifications ── */}
          <section className="settings-section">
            <h2>Notifications</h2>
            <div className="notification-options">
              {([
                { key: 'budgetAlerts',      label: 'Budget Alerts',       desc: 'Get notified when spending nears your limit' },
                { key: 'weeklySummary',     label: 'Weekly Summary',      desc: 'Receive a weekly spending report via email' },
                { key: 'transactionAlerts', label: 'Transaction Alerts',  desc: 'Get notified for every new transaction' },
                { key: 'monthlyReport',     label: 'Monthly Report',      desc: 'Detailed monthly breakdown sent to your email' },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">{label}</span>
                    <span className="toggle-desc">{desc}</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={() => handleToggle(key)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* ── Payment Methods ── */}
          <section className="settings-section">
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
            <button type="button" className="btn-add-card">+ Add Payment Method</button>
          </section>

          {/* ── Account Management ── */}
          <section className="settings-section">
            <h2>Account Management</h2>
            <div className="account-actions">
              <div className="account-action-card">
                <div className="action-info">
                  <span className="action-title">Export Data</span>
                  <span className="action-desc">Download all your transaction data as CSV</span>
                </div>
                <button type="button" className="btn-action-export">Export</button>
              </div>
              <div className="account-action-card">
                <div className="action-info">
                  <span className="action-title">Pause Account</span>
                  <span className="action-desc">Temporarily disable tracking and notifications</span>
                </div>
                <button type="button" className="btn-action-pause">Pause</button>
              </div>
              <div className="account-action-card danger-card">
                <div className="action-info">
                  <span className="action-title">Delete Account</span>
                  <span className="action-desc">Permanently remove your account and all data</span>
                </div>
                <button type="button" className="btn-action-delete">Delete</button>
              </div>
            </div>
          </section>

          {/* ── Save / Discard Bar ── */}
          <div className="save-bar">
            <button type="button" className="btn-save-settings" onClick={handleSave}>
              Save Changes
            </button>
            <button type="button" className="btn-discard" onClick={handleDiscard}>
              Discard
            </button>
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