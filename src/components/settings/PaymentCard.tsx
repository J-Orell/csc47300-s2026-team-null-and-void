import { FC } from 'react'

interface PaymentCardProps {
  type: 'visa' | 'mc'
  lastFour: string
  expiryDate: string
  onRemove: () => void
}

/**
 * PaymentCard - Displays a saved payment method
 * Shows card type, last 4 digits, expiry, and remove button
 */
const PaymentCard: FC<PaymentCardProps> = ({ type, lastFour, expiryDate, onRemove }) => {
  return (
    <div className="payment-card-item">
      <div className="payment-card-info">
        <span className={`card-type-badge ${type}`}>
          {type === 'visa' ? 'VISA' : 'MC'}
        </span>
        <span className="payment-card-number">**** **** **** {lastFour}</span>
      </div>
      <div className="payment-card-meta">
        <span className="payment-card-expiry">Exp: {expiryDate}</span>
        <button type="button" className="btn-remove-card" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  )
}

export default PaymentCard