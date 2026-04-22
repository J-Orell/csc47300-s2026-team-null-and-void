import { FC } from 'react'
import './Toggle.css'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

const Toggle: FC<ToggleProps> = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className={`toggle ${disabled ? 'toggle-disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="toggle-input"
      />
      <span className="toggle-slider" />
      {label && <span className="toggle-label-text">{label}</span>}
    </label>
  )
}

export default Toggle