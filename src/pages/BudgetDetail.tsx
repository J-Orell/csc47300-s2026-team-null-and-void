import { FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader, Button, Badge, ProgressBar } from '../components/common'
import { budgetAPI } from '../utils/api'
import { ApiBudget } from '../types/api'
import '../styles/Admin.css'

const BudgetDetail: FC = () => {
  const { budgetId } = useParams<{ budgetId: string }>()
  const navigate = useNavigate()
  const [budget, setBudget] = useState<ApiBudget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!budgetId) return
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await budgetAPI.getBudgetById(budgetId)
        setBudget(res.data.budget)
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined
        setError(message || 'Budget not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [budgetId])

  const handleDelete = async () => {
    if (!budgetId || !window.confirm('Delete this budget?')) return
    try {
      await budgetAPI.deleteBudget(budgetId)
      navigate('/budget', { replace: true })
    } catch {
      alert('Failed to delete budget')
    }
  }

  const formatMonth = (value: string) =>
    new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })

  if (loading) {
    return (
      <main className="detail-page">
        <div className="loading">Loading budget...</div>
      </main>
    )
  }

  if (error || !budget) {
    return (
      <main className="detail-page">
        <p className="auth-error-message">{error || 'Not found'}</p>
        <Link className="admin-link" to="/budget">
          ← Back to budgets
        </Link>
      </main>
    )
  }

  const pct = Math.min((budget.spentAmount / budget.budgetedAmount) * 100, 100)
  const remain = budget.budgetedAmount - budget.spentAmount
  const state = pct >= 95 ? 'danger' : pct >= 70 ? 'warning' : 'safe'

  return (
    <main className="detail-page">
      <div className="admin-breadcrumb">
        <Link to="/budget">Budgets</Link> / {budget._id}
      </div>

      <PageHeader
        title={budget.name}
        subtitle={`Budget ID: ${budget._id}`}
      />

      <article className="detail-card">
        <div className="detail-row">
          <span className="detail-label">Month</span>
          <span className="detail-value">{formatMonth(budget.month)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Category</span>
          <Badge variant="category">{budget.category}</Badge>
        </div>
        <div className="detail-row">
          <span className="detail-label">Budgeted</span>
          <span className="detail-value">${budget.budgetedAmount.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Spent</span>
          <span className="detail-value">${budget.spentAmount.toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Remaining</span>
          <span className={`detail-value ${state}`}>
            {remain < 0
              ? `Over by $${Math.abs(remain).toFixed(2)}`
              : `$${remain.toFixed(2)}`}
          </span>
        </div>
        <ProgressBar percentage={pct} variant={state} />
        {budget.description && (
          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span className="detail-value">{budget.description}</span>
          </div>
        )}
        <div className="detail-actions">
          <Link to="/budget">
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

export default BudgetDetail
