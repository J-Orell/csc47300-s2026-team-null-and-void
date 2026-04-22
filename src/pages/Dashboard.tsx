import { FC } from 'react'
import MonthlyChart from '../components/MonthlyChart'
import CategoryChart from '../components/CategoryChart'
import useDashboardData from '../hooks/useDashboardData'
import { formatNumber, getCurrentDate } from '../utils/helpers'
import { Card, PageHeader } from '../components/common'
import '../styles/Dashboard.css'

const Dashboard: FC = () => {
  const { data, loading, error } = useDashboardData()

  if (loading) return <main><div className="loading">Loading dashboard...</div></main>
  if (error) return <main><div className="error">Error loading dashboard: {error.message}</div></main>
  if (!data) return <main><div className="error">No data available</div></main>

  return (
    <main className="dashboard-container">
      {/* Page Header */}
      <PageHeader
        title="Financial Overview"
        subtitle="Monitor your income, expenses, and savings at a glance"
        extra={getCurrentDate()}
      />

      {/* Stats Grid */}
      <div className="summary-cards">
        <Card variant="stat">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-label">Total Income</div>
            <div className="stat-value stat-value-income">${formatNumber(data.currentMonth.totalIncome)}</div>
          </div>
        </Card>

        <Card variant="stat">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value stat-value-expense">${formatNumber(data.currentMonth.totalExpenses)}</div>
          </div>
        </Card>

        <Card variant="stat">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-label">Total Savings</div>
            <div className="stat-value stat-value-savings">${formatNumber(data.currentMonth.savings)}</div>
          </div>
        </Card>

        <Card variant="stat">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-label">Savings Rate</div>
            <div className="stat-value stat-value-rate">{data.currentMonth.savingsRate}</div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <Card variant="chart">
          <div className="chart-header">
            <h2>Monthly Income vs Expenses</h2>
            <p className="chart-subtitle">6-month comparison</p>
          </div>
          <div className="chart-container">
            <MonthlyChart data={data.monthlyData} />
          </div>
        </Card>

        <Card variant="chart">
          <div className="chart-header">
            <h2>Expense Breakdown by Category</h2>
            <p className="chart-subtitle">Current month distribution</p>
          </div>
          <div className="chart-container pie-container">
            <CategoryChart data={data.categoryBreakdown} />
          </div>
        </Card>
      </div>

      {/* Expense Categories */}
      <div className="category-details">
        <h3 className="section-title">Expense Categories</h3>
        <div className="category-list">
          {Object.entries(data.categoryBreakdown).map(([name, amount]) => {
            const total = Object.values(data.categoryBreakdown).reduce((a, b) => a + b, 0)
            const percentage = ((amount / total) * 100).toFixed(1)
            return (
              <div key={name} className="category-item">
                <div className="category-name">{name}</div>
                <div className="category-amount">${formatNumber(amount)}</div>
                <div className="category-percentage">{percentage}% of total</div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default Dashboard