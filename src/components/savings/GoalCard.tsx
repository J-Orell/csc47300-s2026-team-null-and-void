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
    <Card style={{ padding: '1.5rem' }} hover>
      {/* Goal header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 4px 0' }}>
            {name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-faint)', margin: 0 }}>
            Deadline: {new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button
          onClick={onDelete}
          className="icon-btn danger"
          title="Delete goal"
        >
          🗑
        </button>
      </div>

      {/* Progress */}
      <div style={{ background: 'var(--bg-section)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Progress</span>
          <span style={{ color: 'var(--text-medium)' }}>
            ${currentSavings.toFixed(2)} / ${targetAmount.toFixed(2)}
          </span>
        </div>
        <ProgressBar percentage={progress} reversed={true} />
        <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginTop: '0.4rem' }}>
          {progress}% complete
        </div>
      </div>

      {/* Monthly info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        background: isOnTrack ? 'rgba(76,175,80,0.1)' : 'rgba(255,107,107,0.1)',
        borderLeft: `4px solid ${isOnTrack ? 'var(--green-main)' : 'var(--red-main)'}`
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase' }}>
            Monthly Target
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isOnTrack ? 'var(--green-main)' : 'var(--red-main)' }}>
            ${monthlyNeeded.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase' }}>
            Status
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isOnTrack ? 'var(--green-main)' : 'var(--red-main)' }}>
            {isOnTrack ? '✓ On Track' : '⚠ Behind'}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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