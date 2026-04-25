import { FC, ReactNode } from 'react'
import { Card } from '../common'

interface ChartCardProps {
  title: string
  subtitle: string
  children: ReactNode
  className?: string
}

/**
 * ChartCard - Wrapper for dashboard charts with consistent header styling
 * @param title - Main chart title
 * @param subtitle - Descriptive subtitle
 * @param children - Chart component to render
 */
const ChartCard: FC<ChartCardProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <Card variant="chart" className={className}>
      <div className="chart-header">
        <h2>{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      <div className="chart-container">
        {children}
      </div>
    </Card>
  )
}

export default ChartCard