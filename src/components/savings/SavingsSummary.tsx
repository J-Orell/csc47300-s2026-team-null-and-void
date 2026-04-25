import { FC } from 'react'
import { Card } from '../common'

interface SavingsSummaryProps {
  totalSavedThisMonth: number
  isOnTrack: boolean
  projectedCompletion: string
}

/**
 * SavingsSummary - Displays overall savings statistics
 */
const SavingsSummary: FC<SavingsSummaryProps> = ({ totalSavedThisMonth, isOnTrack, projectedCompletion }) => {
  return (
    <div className="summary-cards">
      <Card variant="stat" className="stat-card-income">
        <div className="stat-icon">💰</div>
        <div className="stat-info">
          <div className="stat-label">This Month Saved</div>
          <div className="stat-value stat-value-saved">${totalSavedThisMonth}</div>
        </div>
      </Card>

      <Card variant="stat" className="stat-card-rate">
        <div className="stat-icon">{isOnTrack ? '✅' : '❌'}</div>
        <div className="stat-info">
          <div className="stat-label">On Track</div>
          <div
            className="stat-value stat-value-track"
            style={{ color: isOnTrack ? 'var(--green-main)' : 'var(--red-main)' }}
          >
            {isOnTrack ? 'Yes' : 'No'}
          </div>
        </div>
      </Card>

      <Card variant="stat" className="stat-card-savings">
        <div className="stat-icon">🎯</div>
        <div className="stat-info">
          <div className="stat-label">Projected Completion</div>
          <div className="stat-value stat-value-Completion">{projectedCompletion}</div>
        </div>
      </Card>
    </div>
  )
}

export default SavingsSummary