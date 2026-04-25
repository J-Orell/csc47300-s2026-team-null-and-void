import { FC } from 'react'
import { Transaction } from '../../types'
import TransactionRow from './TransactionRow'

interface TransactionTableProps {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => void
}

/**
 * TransactionTable - Displays transactions in a table format
 * Includes header and maps through transaction rows
 */
const TransactionTable: FC<TransactionTableProps> = ({ transactions, onEdit, onDelete }) => {
  return (
    <table className="transactions-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <TransactionRow
            key={tx.id}
            transaction={tx}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  )
}

export default TransactionTable