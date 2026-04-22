import { FC, ButtonHTMLAttributes } from 'react'
import './IconButton.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string
  variant?: 'default' | 'danger'
  label?: string
}

const IconButton: FC<IconButtonProps> = ({ 
  icon, 
  variant = 'default',
  label,
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`icon-button icon-button-${variant} ${className}`}
      title={label}
      {...props}
    >
      {icon}
    </button>
  )
}

export default IconButton