import { FC } from 'react'
import { Card, Button, ProgressBar } from '../common'

interface GoalCardProps {
  id: string
  name: string
  targetAmount: number
  currentSavings: number
  deadline: string
  monthlyNeeded: number
  isOnTrack: boolean
  projectedCompletion: string
  onAddMoney: () => void
  onDelete: () => void
}

/**
 * GoalCard - Displays a single savings goal with progress tracking
 * Shows target, current savings, monthly target, and status
 */
const GoalCard: FC<GoalCardProps> = ({
  name,
  targetAmount,
  currentSavings,
  deadline,
  monthlyNeeded,
  isOnTrack,
  projectedCompletion,
  onAddMoney,
  onDelete
}) => {
  const progress = Math.min(100, Math.round((currentSavings / targetAmount) * 100))

  return (
    <Card className="goal-card-wrapper" hover>
      {/* Goal header */}
      <div className="goal-card-header">
        <div>
          <h3 className="goal-card-title">{name}</h3>
          <p className="goal-card-deadline">
            Deadline: {new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button onClick={onDelete} className="icon-btn danger" title="Delete goal">
          🗑
        </button>
      </div>

      {/* Progress */}
      <div className="goal-progress-section">
        <div className="goal-progress-header">
          <span className="goal-progress-label">Progress</span>
          <span className="goal-progress-amount">
            ${currentSavings.toFixed(2)} / ${targetAmount.toFixed(2)}
          </span>
        </div>
        <ProgressBar percentage={progress} reversed={true} />
        <div className="goal-progress-percentage">
          {progress}% complete
        </div>
      </div>

      {/* Monthly info */}
      <div className={`goal-monthly-info ${isOnTrack ? 'on-track' : 'behind'}`}>
        <div className="goal-info-section">
          <div className="goal-info-label">Monthly Target</div>
          <div className={`goal-info-value ${isOnTrack ? 'on-track' : 'behind'}`}>
            ${monthlyNeeded.toFixed(2)}
          </div>
        </div>
        <div className="goal-info-section goal-status-section">
          <div className="goal-info-label">Status</div>
          <div className={`goal-status-value ${isOnTrack ? 'on-track' : 'behind'}`}>
            {isOnTrack ? '✓ On Track' : '⚠ Behind'}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="goal-actions-grid">
        <Button variant="primary" onClick={onAddMoney}>
          Add Money
        </Button>
        <Button variant="ghost" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </Card>
  )
}

export default GoalCard