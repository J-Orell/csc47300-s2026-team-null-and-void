import { FC, useState, useEffect, FormEvent, useCallback } from 'react'
import {
  PageHeader, Modal, FormField,
  EmptyState, CreateFormSection, Button
} from '../components/common'
import { BudgetCard, BudgetSummary } from '../components/budget'
import { budgetAPI } from '../utils/api'
import { ApiBudget } from '../types/api'
import {
  BudgetCardData,
  getApiErrorMessage,
  mapBudgetFromApi,
} from '../utils/mappers'
import { BUDGET_CATEGORIES, categorySelectOptions } from '../constants/categories'
import '../styles/Budget.css'

const Budget: FC = () => {
  const [budgets, setBudgets] = useState<BudgetCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingBudget, setEditingBudget] = useState<BudgetCardData | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [newCat, setNewCat] = useState({
    category: 'Food',
    name: '',
    limit: '',
    spent: '',
    month: new Date().toISOString().slice(0, 7) + '-01',
  })

  const loadBudgets = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await budgetAPI.getUserBudgets()
      const list = (res.data.budgets as ApiBudget[]).map(mapBudgetFromApi)
      setBudgets(list)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load budgets'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBudgets()
  }, [loadBudgets])

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!newCat.name.trim()) {
      setFormError('Please enter a budget name.')
      return
    }
    const limit = parseFloat(newCat.limit)
    if (!limit || limit <= 0) {
      setFormError('Please enter a valid budget limit.')
      return
    }
    const spent = parseFloat(newCat.spent) || 0

    setSaving(true)
    try {
      await budgetAPI.createBudget({
        name: newCat.name.trim(),
        category: newCat.category,
        budgetedAmount: limit,
        month: newCat.month,
        spentAmount: spent,
      })
      await loadBudgets()
      setNewCat({
        category: 'Food',
        name: '',
        limit: '',
        spent: '',
        month: new Date().toISOString().slice(0, 7) + '-01',
      })
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Failed to create budget'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await budgetAPI.deleteBudget(deletingId)
      await loadBudgets()
      setDeletingId(null)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete budget'))
      setDeletingId(null)
    }
  }

  const handleEditSave = async (
    name: string,
    limit: number,
    spent: number,
    category: string,
    onError: (msg: string) => void
  ) => {
    if (!editingBudget) return
    setSaving(true)
    try {
      await budgetAPI.updateBudget(editingBudget.id, {
        name,
        category,
        budgetedAmount: limit,
        spentAmount: spent,
      })
      await loadBudgets()
      setEditingBudget(null)
    } catch (err) {
      onError(getApiErrorMessage(err, 'Failed to update budget'))
    } finally {
      setSaving(false)
    }
  }

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const totalRemain = totalBudget - totalSpent

  if (loading) {
    return (
      <main>
        <div className="loading">Loading budgets...</div>
      </main>
    )
  }

  return (
    <main>
      <div className="budget-container">
        <PageHeader
          title="Budget Manager"
          subtitle="Set monthly limits per category and track your spending."
        />

        {error && <div className="auth-error-message">{error}</div>}

        <BudgetSummary
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          totalRemain={totalRemain}
        />

        {formError && <div className="auth-error-message">{formError}</div>}

        <CreateFormSection
          title="Add New Budget Category"
          onSubmit={handleAdd}
          submitLabel={saving ? 'Adding...' : 'Add'}
        >
          <FormField
            label="Category"
            type="select"
            value={newCat.category}
            onChange={val => setNewCat({ ...newCat, category: val })}
            options={categorySelectOptions(BUDGET_CATEGORIES)}
          />
          <FormField
            label="Budget Name"
            type="text"
            value={newCat.name}
            onChange={val => setNewCat({ ...newCat, name: val })}
            placeholder="e.g. Monthly Groceries"
            required
          />
          <FormField
            label="Month"
            type="date"
            value={newCat.month}
            onChange={val => setNewCat({ ...newCat, month: val })}
            required
          />
          <FormField
            label="Monthly Limit ($)"
            type="number"
            value={newCat.limit}
            onChange={val => setNewCat({ ...newCat, limit: val })}
            placeholder="500"
            min="1"
            required
          />
          <FormField
            label="Spent So Far ($)"
            type="number"
            value={newCat.spent}
            onChange={val => setNewCat({ ...newCat, spent: val })}
            placeholder="0"
            min="0"
          />
        </CreateFormSection>

        {budgets.length === 0 ? (
          <EmptyState
            icon="📋"
            message="No budgets set yet. Add a category above to get started!"
          />
        ) : (
          <div className="budgets-grid">
            {budgets.map(b => (
              <BudgetCard
                key={b.id}
                id={b.id}
                icon={b.icon}
                name={b.name}
                limit={b.limit}
                spent={b.spent}
                onEdit={() => setEditingBudget(b)}
                onDelete={() => setDeletingId(b.id)}
              />
            ))}
          </div>
        )}

        {editingBudget && (
          <Modal
            isOpen={!!editingBudget}
            onClose={() => setEditingBudget(null)}
            title="Edit Budget"
            maxWidth="360px"
          >
            <EditBudgetForm
              budget={editingBudget}
              saving={saving}
              onSave={handleEditSave}
              onCancel={() => setEditingBudget(null)}
            />
          </Modal>
        )}

        <Modal
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          title="Delete Budget"
          maxWidth="360px"
        >
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-medium)' }}>
            Are you sure you want to delete this budget? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="danger" onClick={handleDelete} style={{ flex: 2 }}>
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setDeletingId(null)} style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    </main>
  )
}

const EditBudgetForm: FC<{
  budget: BudgetCardData
  saving: boolean
  onSave: (name: string, limit: number, spent: number, category: string, onError: (msg: string) => void) => void
  onCancel: () => void
}> = ({ budget, saving, onSave, onCancel }) => {
  const [name, setName] = useState(budget.name)
  const [category, setCategory] = useState(budget.category)
  const [limit, setLimit] = useState(String(budget.limit))
  const [spent, setSpent] = useState(String(budget.spent))
  const [formError, setFormError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!name.trim()) {
      setFormError('Please enter a budget name.')
      return
    }
    const l = parseFloat(limit)
    if (!l || l <= 0) {
      setFormError('Please enter a valid limit.')
      return
    }
    onSave(name.trim(), l, parseFloat(spent) || 0, category, setFormError)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Category"
        type="select"
        value={category}
        onChange={setCategory}
        options={categorySelectOptions(BUDGET_CATEGORIES)}
      />
      <FormField label="Budget Name" type="text" value={name} onChange={setName} required />
      <FormField
        label="Monthly Limit ($)"
        type="number"
        value={limit}
        onChange={setLimit}
        min="1"
        required
      />
      <FormField
        label="Spent So Far ($)"
        type="number"
        value={spent}
        onChange={setSpent}
        min="0"
      />
      {formError && <div className="auth-error-message" style={{ marginTop: '0.75rem' }}>{formError}</div>}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button type="submit" variant="primary" loading={saving} style={{ flex: 2 }}>
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} style={{ flex: 1 }}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default Budget
