import { FC } from 'react'
import './ProgressBar.css'

interface ProgressBarProps {
  percentage: number
  variant?: 'safe' | 'warning' | 'danger'
  height?: number
  showLabel?: boolean
  animate?: boolean
}

const ProgressBar: FC<ProgressBarProps> = ({ 
  percentage, 
  variant,
  height = 10,
  showLabel = false,
  animate = true
}) => {
  // Auto-determine variant if not provided
  const getVariant = (): 'safe' | 'warning' | 'danger' => {
    if (variant) return variant
    if (percentage >= 100) return 'danger'
    if (percentage >= 90) return 'warning'
    return 'safe'
  }

  const finalVariant = getVariant()
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

  return (
    <div className="progress-bar-wrapper">
      <div 
        className="progress-bar-container" 
        style={{ height: `${height}px` }}
      >
        <div 
          className={`progress-bar-fill progress-bar-${finalVariant} ${animate ? 'progress-bar-animate' : ''}`}
          style={{ width: `${clampedPercentage}%` }}
        >
          {showLabel && <span className="progress-bar-label">{clampedPercentage.toFixed(0)}%</span>}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar