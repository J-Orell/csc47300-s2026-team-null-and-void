import { FC, ReactNode, CSSProperties } from 'react'
import './Card.css'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'stat' | 'chart' | 'budget' | 'action' | 'form'
  hover?: boolean
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

const Card: FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  hover = true,
  className = '',
  style,
  onClick 
}) => {
  const baseClass = 'card'
  const variantClass = `card-${variant}`
  const hoverClass = hover ? 'card-hover' : ''
  const clickableClass = onClick ? 'card-clickable' : ''

  return (
    <div 
      className={`${baseClass} ${variantClass} ${hoverClass} ${clickableClass} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card