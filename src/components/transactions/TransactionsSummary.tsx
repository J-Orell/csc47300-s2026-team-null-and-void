import { FC } from 'react'
import { Card } from '../common'

interface TransactionsSummaryProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

/**
 * TransactionsSummary - Displays transaction summary statistics
 * Shows total income, expenses, and remaining balance
 */
const TransactionsSummary: FC<TransactionsSummaryProps> = ({ totalIncome, totalExpenses, balance }) => {
  const formatNumber = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="summary-cards">
      <Card variant="stat" className="stat-card-income">
        <div className="stat-icon">💵</div>
        <div className="stat-info">
          <div className="stat-label">Total Income</div>
          <div className="stat-value stat-value-income">${formatNumber(totalIncome)}</div>
        </div>
      </Card>

      <Card variant="stat" className="stat-card-expense">
        <div className="stat-icon">💸</div>
        <div className="stat-info">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value stat-value-expense">${formatNumber(totalExpenses)}</div>
        </div>
      </Card>

      <Card variant="stat" className="stat-card-savings">
        <div className="stat-icon">💳</div>
        <div className="stat-info">
          <div className="stat-label">Remaining Balance</div>
          <div className="stat-value stat-value-savings">${formatNumber(balance)}</div>
        </div>
      </Card>
    </div>
  )
}

export default TransactionsSummary