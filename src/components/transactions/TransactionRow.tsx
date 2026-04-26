import { FC } from 'react'
import { Transaction } from '../../types'
import { IconButton, Badge } from '../common'

interface TransactionRowProps {
  transaction: Transaction
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => void
}

/**
 * TransactionRow - Renders a single transaction in the table
 * Handles formatting of date, amount, and category display
 */
const TransactionRow: FC<TransactionRowProps> = ({ transaction, onEdit, onDelete }) => {
  // Format date
  const formatDate = (dateStr: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const d = new Date(dateStr + 'T00:00:00')
    return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`
  }

  return (
    <tr>
      <td className="transaction-date-cell">
        {formatDate(transaction.date)}
      </td>
      <td className="transaction-description-cell">
        {transaction.description}
      </td>
      <td>
        <Badge variant="category" className={`badge-${transaction.category.toLowerCase()}`}>
          {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
        </Badge>
      </td>
      <td className={`tx-amount-cell ${transaction.type}`}>
        ${transaction.amount.toFixed(2)}
      </td>
      <td className="transaction-actions-cell">
        <IconButton icon="✏️" label="Edit" onClick={() => onEdit(transaction)} />
        <IconButton icon="🗑" label="Delete" variant="danger" onClick={() => onDelete(transaction.id)} />
      </td>
    </tr>
  )
}

export default TransactionRow