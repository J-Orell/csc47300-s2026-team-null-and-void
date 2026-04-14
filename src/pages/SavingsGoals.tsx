import { FC, useState } from 'react'
import StatCard from '../components/StatCard'

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentSavings: number
  deadline: string
  createdDate: string
}

interface AddMoneyModalProps {
  goalName: string
  onClose: () => void
  onAdd: (amount: number) => void
}

const AddMoneyModal: FC<AddMoneyModalProps> = ({ goalName, onClose, onAdd }) => {
  const [amount, setAmount] = useState('')

  const handleAdd = () => {
    const n = parseFloat(amount)
    if (!n || n <= 0) { alert('Please enter a valid amount.'); return }
    onAdd(n)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <h2>Add Money</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ marginBottom: '1rem', color: 'var(--text-medium)', fontSize: '0.95rem' }}>
          Adding to: <strong>{goalName}</strong>
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-medium)', textTransform: 'uppercase' }}>
            Amount ($)
          </label>
          <input
            type="number"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem',
              border: '2px solid var(--border-light)', borderRadius: '8px',
              fontSize: '0.95rem', fontFamily: 'inherit',
            }}
            autoFocus
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleAdd}
            style={{
              flex: 2, padding: '0.75rem',
              background: 'var(--gradient-green)', color: 'white',
              border: 'none', borderRadius: '8px', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.95rem',
            }}
          >Add Money</button>
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

const SavingsGoals: FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: '1', name: 'Vacation to Hawaii', targetAmount: 10000, currentSavings: 2500,  deadline: '2026-12-31', createdDate: '2026-01-15' },
    { id: '2', name: 'Emergency Fund',      targetAmount: 15000, currentSavings: 8500,  deadline: '2026-11-30', createdDate: '2026-02-01' },
    { id: '3', name: 'New Laptop',          targetAmount: 2000,  currentSavings: 1800,  deadline: '2026-06-15', createdDate: '2026-03-01' },
  ])

  const [formData, setFormData] = useState({ goalName: '', targetAmount: '', deadline: '' })
  const [addMoneyGoalId, setAddMoneyGoalId] = useState<string | null>(null)

  /* totalThisMonth: sum of current savings added this month */
  const totalThisMonth = 450

  /* Helpers */
  const calculateMonthlyNeeded = (goal: SavingsGoal): number => {
    const deadlineDate    = new Date(goal.deadline)
    const today           = new Date()
    const monthsRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)))
    const amountRemaining = Math.max(0, goal.targetAmount - goal.currentSavings)
    return Math.round((amountRemaining / monthsRemaining) * 100) / 100
  }

  const calculateProgress = (goal: SavingsGoal): number =>
    Math.min(100, Math.round((goal.currentSavings / goal.targetAmount) * 100))

  const isOnTrack = (goal: SavingsGoal): boolean =>
    totalThisMonth >= calculateMonthlyNeeded(goal)

  const getProjectedCompletion = (goal: SavingsGoal): string => {
    if (goal.currentSavings >= goal.targetAmount) return 'Completed!'
    const monthsNeeded  = Math.ceil((goal.targetAmount - goal.currentSavings) / (totalThisMonth || 1))
    const projected     = new Date()
    projected.setMonth(projected.getMonth() + monthsNeeded)
    return projected.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  /* Most urgent goal: soonest deadline with remaining amount */
  const topGoal = goals.length > 0
    ? goals
        .filter(g => g.currentSavings < g.targetAmount)
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0]
        ?? goals[0]
    : null

  const suggestion = topGoal
    ? `You need to save $${calculateMonthlyNeeded(topGoal).toFixed(2)}/month to reach "${topGoal.name}" by ${new Date(topGoal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'Create a savings goal to get personalized recommendations'

  /* CRUD */
  const handleAddGoal = () => {
    if (!formData.goalName.trim())  { alert('Please enter a goal name.'); return }
    if (!formData.targetAmount)     { alert('Please enter a target amount.'); return }
    if (!formData.deadline)         { alert('Please select a deadline.'); return }
    const newGoal: SavingsGoal = {
      id:             String(Date.now()),
      name:           formData.goalName.trim(),
      targetAmount:   parseFloat(formData.targetAmount),
      currentSavings: 0,
      deadline:       formData.deadline,
      createdDate:    new Date().toISOString().split('T')[0],
    }
    setGoals(prev => [...prev, newGoal])
    setFormData({ goalName: '', targetAmount: '', deadline: '' })
  }

  const handleDeleteGoal = (id: string) => {
    const g = goals.find(g => g.id === id)
    if (!g) return
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const handleAddMoney = (amount: number) => {
    setGoals(prev => prev.map(g =>
      g.id === addMoneyGoalId
        ? { ...g, currentSavings: Math.min(g.targetAmount, g.currentSavings + amount) }
        : g
    ))
    setAddMoneyGoalId(null)
  }

  const addMoneyGoal = goals.find(g => g.id === addMoneyGoalId) ?? null

  /* Input style reuse */
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem',
    border: '1px solid var(--border-light)', borderRadius: '8px',
    fontSize: '0.95rem', fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.85rem', fontWeight: 600,
    marginBottom: '0.5rem', color: 'var(--text-medium)',
    textTransform: 'uppercase', letterSpacing: '0.3px',
  }

  return (
    <main>
      <div className="savings-goals-container">
        <header>
          <h1>Smart Savings Goals</h1>
          <p>Track and automate your savings targets</p>
        </header>

        {/* Create Goal */}
        <div style={{
          background: 'var(--bg-white)', borderRadius: 'var(--card-radius-lg)',
          padding: '1.75rem 2rem', marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-card)',
          animation: 'slideInUp 0.6s ease backwards',
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--green-dark)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--green-border)' }}>
            Create New Goal
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
            <div>
              <label style={labelStyle}>Goal Name</label>
              <input type="text" placeholder="e.g., Vacation" style={inputStyle}
                value={formData.goalName} onChange={e => setFormData({ ...formData, goalName: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Target Amount ($)</label>
              <input type="number" placeholder="10000" style={inputStyle}
                value={formData.targetAmount} onChange={e => setFormData({ ...formData, targetAmount: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Deadline</label>
              <input type="date" style={inputStyle}
                value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
            </div>
            <button onClick={handleAddGoal} style={{
              width: '100%', padding: '0.75rem',
              background: 'var(--gradient-green)', color: 'white',
              border: 'none', borderRadius: '8px', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.95rem',
              boxShadow: 'var(--shadow-green)', transition: 'all 0.2s',
            }}>Create Goal</button>
          </div>
        </div>

        {/* Smart Suggestion */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(46,125,50,0.08), rgba(76,175,80,0.08))',
          borderLeft: '4px solid var(--green-mid)', borderRadius: '8px',
          padding: '1.25rem 1.5rem', marginBottom: '2rem',
          border: '1px solid rgba(76,175,80,0.25)',
          animation: 'slideInUp 0.6s ease backwards', animationDelay: '0.1s'
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--green-dark)', marginBottom: '0.4rem' }}>
            💡 Smart Suggestion
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--green-main)', margin: 0 }}>{suggestion}</p>
        </div>

        {/* Insights Strip now uses standard StatCard components */}
        <div className="summary-cards" style={{ marginBottom: '2rem' }}>
          <StatCard 
            icon="💰" 
            label="This Month Saved" 
            value={`$${totalThisMonth}`} 
            type="income" 
          />
          <StatCard 
            icon="✅" 
            label="On Track" 
            value={goals.length > 0 && goals.every(g => isOnTrack(g)) ? 'Yes' : 'No'} 
            type="rate" 
          />
          <StatCard 
            icon="🎯" 
            label={topGoal ? 'Projected Completion' : 'Status'} 
            value={topGoal ? getProjectedCompletion(topGoal) : 'N/A'} 
            type="savings" 
          />
        </div>

        {/* Active Goals */}
        <div style={{ animation: 'slideInUp 0.6s ease backwards', animationDelay: '0.3s' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-dark)', fontWeight: 700 }}>
            Active Goals ({goals.length})
          </h2>

          {goals.length === 0 ? (
            <div className="empty-state">
              <p>🎯 No savings goals yet. Create one to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {goals.map(goal => {
                const progress      = calculateProgress(goal)
                const monthlyNeeded = calculateMonthlyNeeded(goal)
                const onTrack       = isOnTrack(goal)

                return (
                  <div key={goal.id} style={{
                    background: 'var(--bg-white)', borderRadius: 'var(--card-radius-lg)',
                    padding: '1.5rem', boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-card)',
                    transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(46,125,50,0.2)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)' }}
                  >
                    {/* Goal header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 4px 0' }}>
                          {goal.name}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-faint)', margin: 0 }}>
                          Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="icon-btn danger"
                        title="Delete goal"
                      >🗑</button>
                    </div>

                    {/* Progress */}
                    <div style={{ background: 'var(--bg-section)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Progress</span>
                        <span style={{ color: 'var(--text-medium)' }}>
                          ${goal.currentSavings.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: 'var(--border-light)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${progress}%`, height: '100%',
                          background: progress === 100 ? 'var(--green-main)' : 'linear-gradient(90deg, var(--green-dark), var(--green-mid))',
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginTop: '0.4rem' }}>
                        {progress}% complete
                      </div>
                    </div>

                    {/* Monthly info */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem',
                      background: onTrack ? 'rgba(76,175,80,0.1)' : 'rgba(255,107,107,0.1)',
                      borderLeft: `4px solid ${onTrack ? 'var(--green-main)' : 'var(--red-main)'}`,
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Target</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: onTrack ? 'var(--green-main)' : 'var(--red-main)' }}>
                          ${monthlyNeeded.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase' }}>Status</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: onTrack ? 'var(--green-main)' : 'var(--red-main)' }}>
                          {onTrack ? '✓ On Track' : '⚠ Behind'}
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button
                        onClick={() => setAddMoneyGoalId(goal.id)}
                        style={{
                          padding: '0.75rem', background: 'var(--gradient-green)',
                          color: 'white', border: 'none', borderRadius: '6px',
                          fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                        }}
                      >Add Money</button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        style={{
                          padding: '0.75rem', background: 'var(--bg-light)',
                          color: 'var(--text-dark)', border: '1px solid var(--border-light)',
                          borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                        }}
                      >Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {addMoneyGoal && (
        <AddMoneyModal
          goalName={addMoneyGoal.name}
          onClose={() => setAddMoneyGoalId(null)}
          onAdd={handleAddMoney}
        />
      )}
    </main>
  )
}

export default SavingsGoals