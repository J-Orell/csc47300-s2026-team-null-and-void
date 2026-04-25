import { useState, useCallback } from 'react'

interface UserSettings {
  fullName: string
  email: string
  phone: string
  currency: string
  threshold: number
  dateFormat: string
  budgetCycleStart: string
}

interface NotificationSettings {
  budgetAlerts: boolean
  weeklySummary: boolean
  transactionAlerts: boolean
  monthlyReport: boolean
}

/**
 * useSettings - Manages all settings state and logic
 * Handles user settings, notifications, save state, and reset
 */
export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    fullName: 'Raeesah Iram',
    email: 'riram000@citymail.cuny.edu',
    phone: '(212) 555-0199',
    currency: 'USD',
    threshold: 90,
    dateFormat: 'mdy',
    budgetCycleStart: '1',
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    budgetAlerts: true,
    weeklySummary: true,
    transactionAlerts: false,
    monthlyReport: true,
  })

  const [saved, setSaved] = useState(false)

  /**
   * Update a single settings field
   */
  const updateSetting = useCallback((field: keyof UserSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }, [])

  /**
   * Toggle a notification preference
   */
  const toggleNotification = useCallback((field: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }))
    setSaved(false)
  }, [])

  /**
   * Save all settings
   */
  const saveSettings = useCallback(() => {
    // In a real app, this would make an API call
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }, [])

  /**
   * Reset settings to defaults
   */
  const resetSettings = useCallback(() => {
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
  }, [])

  return {
    settings,
    notifications,
    saved,
    updateSetting,
    toggleNotification,
    saveSettings,
    resetSettings
  }
}