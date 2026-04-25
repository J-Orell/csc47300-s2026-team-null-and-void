import { FC } from 'react'
import useDashboardData from '../hooks/useDashboardData'
import { getCurrentDate } from '../utils/helpers'
import { PageHeader } from '../components/common'
import {
  ChartCard,
  CategoryDetail,
  DashboardSummary,
  MonthlyChart,
  CategoryChart
} from '../components/dashboard'
import '../styles/Dashboard.css'

const Dashboard: FC = () => {
  const { data, loading, error } = useDashboardData()

  if (loading) return <main><div className="loading">Loading dashboard...</div></main>
  if (error) return <main><div className="error">Error loading dashboard: {error.message}</div></main>
  if (!data) return <main><div className="error">No data available</div></main>

  // Calculate category breakdown data
  const categoryEntries = Object.entries(data.categoryBreakdown)
  const total = categoryEntries.reduce((sum, [, amount]) => sum + amount, 0)

  return (
    <main className="dashboard-container">
      {/* Page Header */}
      <PageHeader
        title="Financial Overview"
        subtitle="Monitor your income, expenses, and savings at a glance"
        extra={getCurrentDate()}
      />

      {/* Dashboard Summary */}
      <DashboardSummary
        totalIncome={data.currentMonth.totalIncome}
        totalExpenses={data.currentMonth.totalExpenses}
        totalSavings={data.currentMonth.savings}
        savingsRate={data.currentMonth.savingsRate}
      />

      {/* Charts Section */}
      <div className="charts-section">
        <ChartCard
          title="Monthly Income vs Expenses"
          subtitle="6-month comparison"
        >
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

      {/* Expense Categories */}
      <div className="category-details">
        <h3 className="section-title">Expense Categories</h3>
        <div className="category-list">
          {categoryEntries.map(([name, amount]) => {
            const percentage = ((amount / total) * 100).toFixed(1)
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
      </div>
    </main>
  )
}

export default Dashboard