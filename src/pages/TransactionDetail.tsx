import { FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader, Button, Badge } from '../components/common'
import { transactionAPI } from '../utils/api'
import { ApiTransaction } from '../types/api'
import '../styles/Admin.css'

const TransactionDetail: FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState<ApiTransaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!transactionId) return
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await transactionAPI.getTransactionById(transactionId)
        setTransaction(res.data.transaction)
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined
        setError(message || 'Transaction not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [transactionId])

  const handleDelete = async () => {
    if (!transactionId || !window.confirm('Delete this transaction?')) return
    try {
      await transactionAPI.deleteTransaction(transactionId)
      navigate('/transactions', { replace: true })
    } catch {
      alert('Failed to delete transaction')
    }
  }

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const budgetName =
    transaction?.budget &&
    typeof transaction.budget === 'object' &&
    'name' in transaction.budget
      ? transaction.budget.name
      : null

  if (loading) {
    return (
      <main className="detail-page">
        <div className="loading">Loading transaction...</div>
      </main>
    )
  }

  if (error || !transaction) {
    return (
      <main className="detail-page">
        <p className="auth-error-message">{error || 'Not found'}</p>
        <Link className="admin-link" to="/transactions">
          ← Back to transactions
        </Link>
      </main>
    )
  }

  return (
    <main className="detail-page">
      <div className="admin-breadcrumb">
        <Link to="/transactions">Transactions</Link> / {transaction._id}
      </div>

      <PageHeader
        title={transaction.description}
        subtitle={`Transaction ID: ${transaction._id}`}
      />

      <article className="detail-card">
        <div className="detail-row">
          <span className="detail-label">Date</span>
          <span className="detail-value">{formatDate(transaction.date)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Type</span>
          <Badge variant={transaction.type === 'income' ? 'success' : 'category'}>
            {transaction.type}
          </Badge>
        </div>
        <div className="detail-row">
          <span className="detail-label">Category</span>
          <span className="detail-value">{transaction.category}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Amount</span>
          <span className={`detail-value ${transaction.type}`}>
            ${transaction.amount.toFixed(2)}
          </span>
        </div>
        {budgetName && (
          <div className="detail-row">
            <span className="detail-label">Linked budget</span>
            <span className="detail-value">{budgetName}</span>
          </div>
        )}
        {transaction.notes && (
          <div className="detail-row">
            <span className="detail-label">Notes</span>
            <span className="detail-value">{transaction.notes}</span>
          </div>
        )}
        <div className="detail-actions">
          <Link to="/transactions">
            <Button variant="secondary">Back to list</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </article>
    </main>
  )
}

export default TransactionDetail
