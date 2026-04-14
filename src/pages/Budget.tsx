import { FC, useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import { Budget as BudgetType } from '../types'
import '../styles/Budget.css'

type BudgetState = 'safe' | 'warning' | 'danger'

interface BudgetCategory extends BudgetType {
  id: string
  icon: string
}

interface EditModalProps {
  budget: BudgetCategory
  onClose: () => void
  onSave: (name: string, limit: number, spent: number) => void
}

const EditModal: FC<EditModalProps> = ({ budget, onClose, onSave }) => {
  const [name,  setName]  = useState(budget.name)
  const [limit, setLimit] = useState(String(budget.limit))
  const [spent, setSpent] = useState(String(budget.spent))

  const handleSave = () => {
    if (!name.trim()) { alert('Please enter a category name.'); return }
    const l = parseFloat(limit)
    if (!l || l <= 0) { alert('Please enter a valid limit.'); return }
    onSave(name.trim(), l, parseFloat(spent) || 0)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth: '360px' }}>
        <div className="modal-header">
          <h2>Edit Budget</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="budget-modal-field">
          <label>Category Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="budget-modal-field">
          <label>Monthly Limit ($)</label>
          <input type="number" min="1" value={limit} onChange={e => setLimit(e.target.value)} />
        </div>
        <div className="budget-modal-field">
          <label>Spent So Far ($)</label>
          <input type="number" min="0" value={spent} onChange={e => setSpent(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 2, padding: '0.75rem',
              background: 'var(--gradient-green)', color: 'white',
              border: 'none', borderRadius: '8px', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.95rem',
            }}
          >Save</button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '0.75rem',
              background: '#e0e0e0', color: 'var(--text-dark)',
              border: 'none', borderRadius: '8px', fontWeight: 600,
              cursor: 'pointer', fontSize: '0.95rem',
            }}
          >Cancel</button>
        </div>
      </div>
    </div>
  )
}

const Budget: FC = () => {
  const [budgets, setBudgets]     = useState<BudgetCategory[]>([])
  const [loading, setLoading]     = useState(true)
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null)

  const [newCat, setNewCat] = useState({
    icon: '🛒', name: '', limit: '', spent: ''
  })

  /* Load from JSON */
  useEffect(() => {
    fetch('/data/budget-data.json')
      .then(r => r.json())
      .then((data: Array<{ icon: string; name: string; limit: number; spent: number }>) => {
        setBudgets(data.map((b, i) => ({ ...b, id: String(i + 1), category: b.name })))
        setLoading(false)
      })
      .catch(() => {
        setBudgets([])
        setLoading(false)
      })
  }, [])

  /* Add */
  const handleAdd = () => {
    if (!newCat.name.trim()) { alert('Please enter a category name.'); return }
    const limit = parseFloat(newCat.limit)
    if (!limit || limit <= 0) { alert('Please enter a valid budget limit.'); return }
    const spent = parseFloat(newCat.spent) || 0
    const nextId = String(Date.now())
    setBudgets(prev => [...prev, {
      id: nextId, icon: newCat.icon, name: newCat.name.trim(),
      category: newCat.name.trim(), limit, spent
    }])
    setNewCat({ icon: '🛒', name: '', limit: '', spent: '' })
  }

  /* Delete */
  const handleDelete = (id: string) => {
    const b = budgets.find(b => b.id === id)
    if (!b) return
    setBudgets(prev => prev.filter(b => b.id !== id))
  }

  /* Edit save */
  const handleEditSave = (name: string, limit: number, spent: number) => {
    if (!editingBudget) return
    setBudgets(prev => prev.map(b =>
      b.id === editingBudget.id ? { ...b, name, category: name, limit, spent } : b
    ))
    setEditingBudget(null)
  }

  /* Totals */
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent  = budgets.reduce((s, b) => s + b.spent, 0)
  const totalRemain = totalBudget - totalSpent

  const getState = (spent: number, limit: number): BudgetState => {
    const pct = (spent / limit) * 100
    if (pct > 100) return 'danger'
    if (pct >= 90)  return 'warning'
    return 'safe'
  }

  if (loading) return <main><div className="loading">Loading budgets...</div></main>

  return (
    <main>
      <div className="budget-container">
        <header>
          <h1>Budget Manager</h1>
          <p>Set monthly limits per category and track your spending.</p>
        </header>

        {/* Summary Strip using StatCard for uniform look */}
        <div className="summary-cards">
          <StatCard 
            icon="📊" 
            label="Total Budget" 
            value={`$${totalBudget.toFixed(2)}`} 
            type="income" 
          />
          <StatCard 
            icon="💸" 
            label="Total Spent" 
            value={`$${totalSpent.toFixed(2)}`} 
            type={totalSpent > totalBudget ? 'expense' : 'rate'} 
          />
          <StatCard 
            icon="💰" 
            label="Remaining" 
            value={`${totalRemain < 0 ? '-$' : '$'}${Math.abs(totalRemain).toFixed(2)}`} 
            type={totalRemain < 0 ? 'expense' : 'savings'} 
          />
        </div>

        {/* Add Form */}
        <div className="add-budget-section">
          <h2>Add New Budget Category</h2>
          <div className="add-budget-form">
            <div className="add-budget-field">
              <label>Icon</label>
              <select value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })}>
                <option value="🛒">🛒 Groceries</option>
                <option value="🚗">🚗 Transport</option>
                <option value="🎬">🎬 Entertainment</option>
                <option value="💡">💡 Utilities</option>
                <option value="🛍">🛍 Shopping</option>
                <option value="🍽">🍽 Dining</option>
                <option value="💊">💊 Health</option>
                <option value="📚">📚 Education</option>
                <option value="✈️">✈️ Travel</option>
                <option value="🏠">🏠 Housing</option>
                <option value="💰">💰 Other</option>
              </select>
            </div>
            <div className="add-budget-field">
              <label>Category Name</label>
              <input
                type="text" placeholder="e.g. Groceries"
                value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })}
              />
            </div>
            <div className="add-budget-field">
              <label>Monthly Limit ($)</label>
              <input
                type="number" placeholder="500" min="1"
                value={newCat.limit} onChange={e => setNewCat({ ...newCat, limit: e.target.value })}
              />
            </div>
            <div className="add-budget-field">
              <label>Spent So Far ($)</label>
              <input
                type="number" placeholder="0" min="0"
                value={newCat.spent} onChange={e => setNewCat({ ...newCat, spent: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button className="btn-add-budget" onClick={handleAdd}>+ Add</button>
            </div>
          </div>
        </div>

        {/* Grid or Empty State */}
        {budgets.length === 0 ? (
          <div className="empty-state">
            <p>📋 No budgets set yet. Add a category above to get started!</p>
          </div>
        ) : (
          <div className="budgets-grid">
            {budgets.map(b => {
              const pct   = Math.min((b.spent / b.limit) * 100, 100)
              const over  = b.spent > b.limit
              const warn  = !over && pct >= 90
              const state = getState(b.spent, b.limit)
              const remain = b.limit - b.spent

              return (
                <div key={b.id} className="budget-card">
                  <div className="budget-card-header">
                    <div className="budget-card-title">
                      <span className="budget-card-icon">{b.icon}</span>
                      <span className="budget-card-name">{b.name}</span>
                    </div>
                    <div className="budget-card-actions">
                      <button
                        className="icon-btn"
                        title="Edit"
                        onClick={() => setEditingBudget(b)}
                      >✏️</button>
                      <button
                        className="icon-btn danger"
                        title="Delete"
                        onClick={() => handleDelete(b.id)}
                      >🗑</button>
                    </div>
                  </div>

                  <div className="budget-amounts">
                    <span className="budget-spent-label">
                      Spent: <span>${b.spent.toFixed(2)}</span>
                    </span>
                    <span className="budget-limit-label">
                      Limit: <span>${b.limit.toFixed(2)}</span>
                    </span>
                  </div>

                  <div className="progress-wrap">
                    <div
                      className={`budget-progress-bar ${state}`}
                      style={{ width: `${pct.toFixed(1)}%` }}
                    />
                  </div>

                  <div className="budget-card-footer">
                    <span className={`budget-remaining ${state}`}>
                      {over
                        ? `Over by $${Math.abs(remain).toFixed(2)}`
                        : `$${remain.toFixed(2)} left`}
                    </span>
                    <span className="budget-pct-label">{pct.toFixed(0)}% used</span>
                  </div>

                  {over && <span className="alert-badge danger">⚠️ Over Budget</span>}
                  {warn && !over && <span className="alert-badge warning">⚠️ Near Limit</span>}
                </div>
              )
            })}
          </div>
        )}

        {editingBudget && (
          <EditModal
            budget={editingBudget}
            onClose={() => setEditingBudget(null)}
            onSave={handleEditSave}
          />
        )}
      </div>
    </main>
  )
}

export default Budget