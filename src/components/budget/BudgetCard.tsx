import { FC } from 'react'
import { Card, IconButton, ProgressBar, Badge } from '../common'

interface BudgetCardProps {
  id: string
  icon: string
  name: string
  limit: number
  spent: number
  onEdit: () => void
  onDelete: () => void
}

/**
 * BudgetCard - Displays a single budget category with progress
 * Shows spending progress, remaining amount, and action buttons
 */
const BudgetCard: FC<BudgetCardProps> = ({ icon, name, limit, spent, onEdit, onDelete }) => {
  const pct = Math.min((spent / limit) * 100, 100)
  const remain = limit - spent
  
  // Determine state based on percentage
  const getState = (): 'safe' | 'warning' | 'danger' => {
    if (pct > 100) return 'danger'
    if (pct >= 90) return 'warning'
    return 'safe'
  }
  
  const state = getState()

  return (
    <Card variant="budget" className="budget-card">
      {/* Header */}
      <div className="budget-card-header">
        <div className="budget-card-title">
          <span className="budget-card-icon">{icon}</span>
          <span className="budget-card-name">{name}</span>
        </div>
        <div className="budget-card-actions">
          <IconButton icon="✏️" label="Edit" onClick={onEdit} />
          <IconButton icon="🗑" label="Delete" variant="danger" onClick={onDelete} />
        </div>
      </div>

      {/* Amounts */}
      <div className="budget-amounts">
        <span className="budget-spent-label">
          Spent: <span>${spent.toFixed(2)}</span>
        </span>
        <span className="budget-limit-label">
          Limit: <span>${limit.toFixed(2)}</span>
        </span>
      </div>

      {/* Progress Bar */}
      <ProgressBar percentage={pct} variant={state} />

      {/* Footer */}
      <div className="budget-card-footer">
        <span className={`budget-remaining ${state}`}>
          {remain < 0
            ? `Over by $${Math.abs(remain).toFixed(2)}`
            : `$${remain.toFixed(2)} left`}
        </span>
        <span className="budget-pct-label">{pct.toFixed(0)}% used</span>
      </div>

      {/* Alerts */}
      {remain < 0 && <Badge variant="danger" size="small">⚠️ Over Budget</Badge>}
      {remain >= 0 && pct >= 90 && <Badge variant="warning" size="small">⚠️ Near Limit</Badge>}
    </Card>
  )
}

export default BudgetCard