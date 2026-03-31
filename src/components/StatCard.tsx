import { FC } from 'react'
import '../styles/StatCard.css'

interface StatCardProps {
  icon: string
  label: string
  value: string
  type: 'income' | 'expense' | 'savings' | 'rate'
}

const StatCard: FC<StatCardProps> = ({ icon, label, value, type }) => {
  return (
    <div className={`stat-card stat-card-${type}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  )
}

export default StatCard
