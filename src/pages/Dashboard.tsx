import { FC } from 'react'
import StatCard from '../components/StatCard'
import MonthlyChart from '../components/MonthlyChart'
import CategoryChart from '../components/CategoryChart'
import useDashboardData from '../hooks/useDashboardData'
import { formatNumber, getCurrentDate } from '../utils/helpers'
import '../styles/Dashboard.css'

const Dashboard: FC = () => {
  const { data, loading, error } = useDashboardData()

  if (loading) return <main><div className="loading">Loading dashboard...</div></main>
  if (error)   return <main><div className="error">Error loading dashboard: {error.message}</div></main>
  if (!data)   return <main><div className="error">No data available</div></main>

  return (
    <main className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Financial Overview</h1>
          <p className="page-subtitle">Monitor your income, expenses, and savings at a glance</p>
        </div>
        <div className="header-date">{getCurrentDate()}</div>
      </div>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard icon="📈" label="Total Income"
          value={`$${formatNumber(data.currentMonth.totalIncome)}`} type="income" />
        <StatCard icon="💸" label="Total Expenses"
          value={`$${formatNumber(data.currentMonth.totalExpenses)}`} type="expense" />
        <StatCard icon="🎯" label="Total Savings"
          value={`$${formatNumber(data.currentMonth.savings)}`} type="savings" />
        <StatCard icon="📊" label="Savings Rate"
          value={data.currentMonth.savingsRate} type="rate" />
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Monthly Income vs Expenses</h2>
            <p className="chart-subtitle">6-month comparison</p>
          </div>
          <div className="chart-container">
            <MonthlyChart data={data.monthlyData} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <h2>Expense Breakdown by Category</h2>
            <p className="chart-subtitle">Current month distribution</p>
          </div>
          <div className="chart-container pie-container">
            <CategoryChart data={data.categoryBreakdown} />
          </div>
        </div>
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