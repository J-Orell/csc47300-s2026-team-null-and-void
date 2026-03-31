import { FC, useState } from 'react'

const Settings: FC = () => {
  const [settings, setSettings] = useState({
    fullName: 'Raeesah Iram',
    email: 'riram000@citymail.cuny.edu',
    phone: '(212) 555-0199',
    currency: 'USD',
    threshold: 90,
    dateFormat: 'mdy',
    budgetCycleStart: 1
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (field: string, value: string | number) => {
    setSettings({ ...settings, [field]: value })
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main>
      <div className="settings-container">
        <header>
          <h1>Settings</h1>
          <p>Manage your account preferences and personal information</p>
        </header>

        <form style={{ maxWidth: '800px' }}>
          {/* Personal Information */}
          <section style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-card)'
          }}>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#333',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #f0f4f8'
            }}>
              Personal Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#666'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={settings.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#666'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#666'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(212) 555-0199"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-card)'
          }}>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#333',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #f0f4f8'
            }}>
              Preferences
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#666'
                }}>
                  Local Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#666'
                }}>
                  Spending Alert Threshold (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.threshold}
                  onChange={(e) => handleChange('threshold', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#666'
                }}>
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="mdy">MM/DD/YYYY</option>
                  <option value="dmy">DD/MM/YYYY</option>
                  <option value="ymd">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#666'
                }}>
                  Budget Cycle Start
                </label>
                <select
                  value={settings.budgetCycleStart}
                  onChange={(e) => handleChange('budgetCycleStart', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value={1}>1st of month</option>
                  <option value={15}>15th of month</option>
                  <option value="last">Last day of month</option>
                </select>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'transform 0.2s'
              }}
            >
              Save Changes
            </button>
          </div>

          {saved && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid #4caf50',
              borderRadius: '8px',
              color: '#2e7d32',
              fontWeight: '500'
            }}>
              ✓ Settings saved successfully!
            </div>
          )}
        </form>
      </div>
    </main>
  )
}

export default Settings
