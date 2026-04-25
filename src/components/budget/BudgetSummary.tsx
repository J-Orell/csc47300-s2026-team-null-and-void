import { FC } from 'react'
import { Card } from '../common'

interface BudgetSummaryProps {
  totalBudget: number
  totalSpent: number
  totalRemain: number
}

/**
 * BudgetSummary - Displays overall budget statistics
 * Shows total budget, total spent, and remaining amount
 */
const BudgetSummary: FC<BudgetSummaryProps> = ({ totalBudget, totalSpent, totalRemain }) => {
  return (
    <div className="summary-cards">
      <Card variant="stat" className="stat-card-income">
        <div className="stat-icon">📊</div>
        <div className="stat-info">
          <div className="stat-label">Total Budget</div>
          <div className="stat-value stat-value-total">${totalBudget.toFixed(2)}</div>
        </div>
      </Card>

      <Card variant="stat" className={totalSpent > totalBudget ? 'stat-card-expense' : 'stat-card-rate'}>
        <div className="stat-icon">💸</div>
        <div className="stat-info">
          <div className="stat-label">Total Spent</div>
          <div className="stat-value stat-value-spent">${totalSpent.toFixed(2)}</div>
        </div>
      </Card>

      <Card variant="stat" className={totalRemain < 0 ? 'stat-card-expense' : 'stat-card-savings'}>
        <div className="stat-icon">💰</div>
        <div className="stat-info">
          <div className="stat-label">Remaining</div>
          <div className="stat-value stat-value-remaining">
            {totalRemain < 0 ? '-$' : '$'}{Math.abs(totalRemain).toFixed(2)}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default BudgetSummary