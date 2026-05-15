import { FC, useCallback, useEffect, useState } from 'react'
import { DashboardData } from '../types'
import { getCurrentDate } from '../utils/helpers'
import { PageHeader } from '../components/common'
import {
  ChartCard, CategoryDetail, DashboardSummary,
  MonthlyChart, CategoryChart
} from '../components/dashboard'
import { transactionAPI } from '../utils/api'
import { ApiTransaction } from '../types/api'
import { buildDashboardFromTransactions, getApiErrorMessage } from '../utils/mappers'
import '../styles/Dashboard.css'

const Dashboard: FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await transactionAPI.getUserTransactions()
      const transactions = res.data.transactions as ApiTransaction[]
      setData(buildDashboardFromTransactions(transactions))
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load dashboard'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (loading) {
    return (
      <main>
        <div className="loading">Loading dashboard...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <div className="error">Error loading dashboard: {error}</div>
      </main>
    )
  }

  if (!data) {
    return (
      <main>
        <div className="error">No data available</div>
      </main>
    )
  }

  const categoryEntries = Object.entries(data.categoryBreakdown)
  const total = categoryEntries.reduce((sum, [, amount]) => sum + amount, 0)

  return (
    <main className="dashboard-container">
      <PageHeader
        title="Financial Overview"
        subtitle="Monitor your income, expenses, and savings at a glance"
        extra={getCurrentDate()}
      />

      <DashboardSummary
        totalIncome={data.currentMonth.totalIncome}
        totalExpenses={data.currentMonth.totalExpenses}
        totalSavings={data.currentMonth.savings}
        savingsRate={data.currentMonth.savingsRate}
      />

      <div className="charts-section">
        <ChartCard title="Monthly Income vs Expenses" subtitle="6-month comparison">
          <MonthlyChart data={data.monthlyData} />
        </ChartCard>

        <ChartCard
          title="Expense Breakdown by Category"
          subtitle="Current month distribution"
          className="pie-container"
        >
          <CategoryChart data={data.categoryBreakdown} />
        </ChartCard>
      </div>

      <div className="category-details">
        <h3 className="section-title">Expense Categories</h3>
        {categoryEntries.length === 0 ? (
          <p>No expenses recorded this month yet.</p>
        ) : (
          <div className="category-list">
            {categoryEntries.map(([name, amount]) => {
              const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : '0'
              return (
                <CategoryDetail
                  key={name}
                  name={name}
                  amount={amount}
                  percentage={parseFloat(percentage)}
                />
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default Dashboard
