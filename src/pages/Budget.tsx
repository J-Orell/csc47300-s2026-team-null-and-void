import { FC, useState, useEffect, FormEvent } from 'react'
import { Budget as BudgetType } from '../types'
import {
  PageHeader,
  Modal,
  FormField,
  EmptyState,
  CreateFormSection,
  Button
} from '../components/common'
import { BudgetCard, BudgetSummary } from '../components/budget'
import '../styles/Budget.css'

interface BudgetCategory extends BudgetType {
  id: string
  icon: string
}

const Budget: FC = () => {
  const [budgets, setBudgets] = useState<BudgetCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null)
  const [newCat, setNewCat] = useState({
    icon: '🛒',
    name: '',
    limit: '',
    spent: ''
  })

  /* Load from JSON */
  useEffect(() => {
    fetch('/data/budget-data.json')
      .then(r => r.json())
      .then((data: Array<{ icon: string; name: string; limit: number; spent: number }>) => {
        setBudgets(data.map((b, i) => ({ ...b, id: String(i + 1) })))
        setLoading(false)
      })
      .catch(() => {
        setBudgets([])
        setLoading(false)
      })
  }, [])

  /* Add */
  const handleAdd = (e: FormEvent) => {
    e.preventDefault()
    if (!newCat.name.trim()) {
      alert('Please enter a category name.')
      return
    }
    const limit = parseFloat(newCat.limit)
    if (!limit || limit <= 0) {
      alert('Please enter a valid budget limit.')
      return
    }
    const spent = parseFloat(newCat.spent) || 0

    const nextId = String(Date.now())
    setBudgets(prev => [...prev, {
      id: nextId,
      icon: newCat.icon,
      name: newCat.name.trim(),
      limit,
      spent
    }])
    setNewCat({ icon: '🛒', name: '', limit: '', spent: '' })
  }

  /* Delete */
  const handleDelete = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id))
  }

  /* Edit save */
  const handleEditSave = (name: string, limit: number, spent: number) => {
    if (!editingBudget) return
    setBudgets(prev => prev.map(b =>
      b.id === editingBudget.id ? { ...b, name, limit, spent } : b
    ))
    setEditingBudget(null)
  }

  /* Totals */
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const totalRemain = totalBudget - totalSpent

  if (loading) return <main><div className="loading">Loading budgets...</div></main>

  return (
    <main>
      <div className="budget-container">
        <PageHeader
          title="Budget Manager"
          subtitle="Set monthly limits per category and track your spending."
        />

        {/* Budget Summary */}
        <BudgetSummary
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          totalRemain={totalRemain}
        />

        {/* Add Form */}
        <CreateFormSection
          title="Add New Budget Category"
          onSubmit={handleAdd}
          submitLabel="Add"
        >
          <FormField
            label="Icon"
            type="select"
            value={newCat.icon}
            onChange={(val) => setNewCat({ ...newCat, icon: val })}
            options={[
              { value: '🛒', label: '🛒 Groceries' },
              { value: '🚗', label: '🚗 Transport' },
              { value: '🎬', label: '🎬 Entertainment' },
              { value: '💡', label: '💡 Utilities' },
              { value: '🛍', label: '🛍 Shopping' },
              { value: '🍽', label: '🍽 Dining' },
              { value: '💊', label: '💊 Health' },
              { value: '📚', label: '📚 Education' },
              { value: '✈️', label: '✈️ Travel' },
              { value: '🏠', label: '🏠 Housing' },
              { value: '💰', label: '💰 Other' }
            ]}
          />
          <FormField
            label="Category Name"
            type="text"
            value={newCat.name}
            onChange={(val) => setNewCat({ ...newCat, name: val })}
            placeholder="e.g. Groceries"
            required
          />
          <FormField
            label="Monthly Limit ($)"
            type="number"
            value={newCat.limit}
            onChange={(val) => setNewCat({ ...newCat, limit: val })}
            placeholder="500"
            min="1"
            required
          />
          <FormField
            label="Spent So Far ($)"
            type="number"
            value={newCat.spent}
            onChange={(val) => setNewCat({ ...newCat, spent: val })}
            placeholder="0"
            min="0"
          />
        </CreateFormSection>

        {/* Grid or Empty State */}
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
                onDelete={() => handleDelete(b.id)}
              />
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingBudget && (
          <Modal
            isOpen={!!editingBudget}
            onClose={() => setEditingBudget(null)}
            title="Edit Budget"
            maxWidth="360px"
          >
            <EditBudgetForm
              budget={editingBudget}
              onSave={handleEditSave}
            />
          </Modal>
        )}
      </div>
    </main>
  )
}

// Edit Budget Form Component
const EditBudgetForm: FC<{
  budget: BudgetCategory
  onSave: (name: string, limit: number, spent: number) => void
}> = ({ budget, onSave }) => {
  const [name, setName] = useState(budget.name)
  const [limit, setLimit] = useState(String(budget.limit))
  const [spent, setSpent] = useState(String(budget.spent))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter a category name.')
      return
    }
    const l = parseFloat(limit)
    if (!l || l <= 0) {
      alert('Please enter a valid limit.')
      return
    }
    onSave(name.trim(), l, parseFloat(spent) || 0)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Category Name"
        type="text"
        value={name}
        onChange={setName}
        required
      />
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
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button type="submit" variant="primary" style={{ flex: 2 }}>Save</Button>
        <Button type="button" variant="secondary" onClick={() => {}} style={{ flex: 1 }}>Cancel</Button>
      </div>
    </form>
  )
}

export default Budget