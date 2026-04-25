import { FC, ReactNode } from 'react'
import { Card } from '../common'

interface SettingsSectionProps {
  title: string
  children: ReactNode
  className?: string
}

/**
 * SettingsSection - Wrapper for settings sections
 * Provides consistent styling and structure for settings groups
 */
const SettingsSection: FC<SettingsSectionProps> = ({ title, children, className = '' }) => {
  return (
    <Card variant="form" className={`settings-section ${className}`}>
      <h2>{title}</h2>
      {children}
    </Card>
  )
}

export default SettingsSection