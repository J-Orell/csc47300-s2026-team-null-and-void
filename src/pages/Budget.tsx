import { FC, useState } from 'react'

interface BudgetCategory {
  id: string
  icon: string
  name: string
  limit: number
  spent: number
}

const Budget: FC = () => {
  const [budgets, setBudgets] = useState<BudgetCategory[]>([
    { id: '1', icon: '🛒', name: 'Groceries', limit: 400, spent: 245 },
    { id: '2', icon: '🚗', name: 'Transport', limit: 200, spent: 125 },
    { id: '3', icon: '🎬', name: 'Entertainment', limit: 150, spent: 80 },
    { id: '4', icon: '💡', name: 'Utilities', limit: 150, spent: 90 },
    { id: '5', icon: '🛍️', name: 'Shopping', limit: 300, spent: 240 },
    { id: '6', icon: '🍽️', name: 'Dining', limit: 250, spent: 165 },
  ])

  const [newCategory, setNewCategory] = useState({
    icon: '🛒',
    name: '',
    limit: '',
    spent: ''
  })
  // Function to add a new budget category
  const handleAddBudget = () => {
    if (newCategory.name && newCategory.limit) {
      const newBudget: BudgetCategory = {
        id: String(budgets.length + 1),
        icon: newCategory.icon,
        name: newCategory.name,
        limit: parseFloat(newCategory.limit),
        spent: parseFloat(newCategory.spent) || 0
      }
      setBudgets([...budgets, newBudget])
      setNewCategory({ icon: '🛒', name: '', limit: '', spent: '' })
    }
  }
  // Function to remove a budget category by ID
  const removeBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id))
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 90) return '#ff6b6b'
    if (percentage >= 70) return '#ffc107'
    return '#4caf50'
  }

  return (
    <main>
      <div className="budget-container">
        <header>
          <h1>Budget Manager</h1>
          <p>Set monthly limits per category and track your spending.</p>
        </header>

        <div className="summary-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon income">💰</div>
            <div className="stat-info">
              <div className="stat-label">Total Budget</div>
              <div className="stat-value">${totalBudget.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card expense">
            <div className="stat-icon expense-icon">💸</div>
            <div className="stat-info">
              <div className="stat-label">Total Spent</div>
              <div className="stat-value">${totalSpent.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rate-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-label">Remaining</div>
              <div className="stat-value" style={{ color: totalRemaining >= 0 ? '#4caf50' : '#ff6b6b' }}>
                ${totalRemaining.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-card)'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#333' }}>Add New Budget Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#666' }}>Icon</label>
              <select
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '0.95rem'
                }}
              >
                <option value="🛒">🛒 Groceries</option>
                <option value="🚗">🚗 Transport</option>
                <option value="🎬">🎬 Entertainment</option>
                <option value="💡">💡 Utilities</option>
                <option value="🛍️">🛍️ Shopping</option>
                <option value="🍽️">🍽️ Dining</option>
                <option value="💊">💊 Health</option>
                <option value="📚">📚 Education</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#666' }}>Category Name</label>
              <input
                type="text"
                placeholder="e.g. Groceries"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#666' }}>Monthly Limit ($)</label>
              <input
                type="number"
                placeholder="500"
                value={newCategory.limit}
                onChange={(e) => setNewCategory({ ...newCategory, limit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: '#666' }}>Spent So Far ($)</label>
              <input
                type="number"
                placeholder="0"
                value={newCategory.spent}
                onChange={(e) => setNewCategory({ ...newCategory, spent: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={handleAddBudget}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {budgets.map(budget => {
            const percentage = (budget.spent / budget.limit) * 100
            const barColor = getProgressColor(budget.spent, budget.limit)
            return (
              <div
                key={budget.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-card)',
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => removeBudget(budget.id)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{budget.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', margin: '0 0 0.5rem 0' }}>
                    {budget.name}
                  </h3>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: '#666' }}>Spent</span>
                    <span style={{ fontWeight: '600', color: '#333' }}>
                      ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        height: '100%',
                        backgroundColor: barColor,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  {percentage >= 90
                    ? '🚨 Very close to limit!'
                    : percentage >= 70
                    ? '⚠️ Getting close to limit'
                    : '✅ Great progress!'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default Budget
