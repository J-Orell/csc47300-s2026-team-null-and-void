import { FC } from 'react'
import Button from './Button'
import './EmptyState.css'

interface EmptyStateProps {
  icon: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState: FC<EmptyStateProps> = ({ icon, message, action }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <p className="empty-state-message">{message}</p>
      {action && (
        <Button 
          variant="primary" 
          onClick={action.onClick}
          className="empty-state-action"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState