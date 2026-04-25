import { FC } from 'react'
import { Toggle } from '../common'

interface NotificationToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/**
 * NotificationToggle - Individual notification preference toggle
 * Displays toggle with label and description
 */
const NotificationToggle: FC<NotificationToggleProps> = ({
  label,
  description,
  checked,
  onChange
}) => {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
        <span className="toggle-desc">{description}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

export default NotificationToggle