import { FC } from 'react'
import { Card } from '../common'
import { formatNumber } from '../../utils/helpers'

interface DashboardSummaryProps {
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  savingsRate: string
}

/**
 * DashboardSummary - Displays main dashboard statistics
 * Shows total income, expenses, savings, and savings rate
 */
const DashboardSummary: FC<DashboardSummaryProps> = ({
  totalIncome,
  totalExpenses,
  totalSavings,
  savingsRate
}) => {
  return (
    <div className="summary-cards">
      <Card variant="stat">
        <div className="stat-icon">📈</div>
        <div className="stat-info">
          <div className="stat-label">Total Income</div>
          <div className="stat-value stat-value-income">
            ${formatNumber(totalIncome)}
          </div>
        </div>
      </Card>

      <Card variant="stat">
        <div className="stat-icon">💸</div>
        <div className="stat-info">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value stat-value-expense">
            ${formatNumber(totalExpenses)}
          </div>
        </div>
      </Card>

      <Card variant="stat">
        <div className="stat-icon">🎯</div>
        <div className="stat-info">
          <div className="stat-label">Total Savings</div>
          <div className="stat-value stat-value-savings">
            ${formatNumber(totalSavings)}
          </div>
        </div>
      </Card>

      <Card variant="stat">
        <div className="stat-icon">📊</div>
        <div className="stat-info">
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value stat-value-rate">
            {savingsRate}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DashboardSummary