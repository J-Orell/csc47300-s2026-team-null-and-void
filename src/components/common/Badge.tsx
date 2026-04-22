import { FC, ReactNode } from 'react'
import './Badge.css'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'category'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const Badge: FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  className = ''
}) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  )
}

export default Badge