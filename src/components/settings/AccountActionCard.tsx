import { FC, ReactNode } from 'react'
import { Card, Button } from '../common'

interface AccountActionCardProps {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
  variant?: 'default' | 'danger'
  buttonVariant?: 'primary' | 'secondary' | 'danger'
  buttonClassName?: string
}

/**
 * AccountActionCard - Displays an account management action
 * Used for export data, pause account, delete account, etc.
 */
const AccountActionCard: FC<AccountActionCardProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  buttonVariant = 'primary',
  buttonClassName = ''
}) => {
  return (
    <Card variant="action" className={variant === 'danger' ? 'danger-card' : ''}>
      <div className="action-info">
        <span className="action-title">{title}</span>
        <span className="action-desc">{description}</span>
      </div>
      <Button
        variant={buttonVariant}
        size="small"
        className={buttonClassName}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </Card>
  )
}

export default AccountActionCard