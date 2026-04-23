import { FC, useState, FormEvent } from 'react'
import { 
  Card, 
  PageHeader, 
  Button, 
  Modal, 
  FormField, 
  EmptyState,
  ProgressBar,
  CreateFormSection
} from '../components/common'
import '../styles/SavingsGoals.css'

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentSavings: number
  deadline: string
  createdDate: string
}

const SavingsGoals: FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: '1', name: 'Vacation to Hawaii', targetAmount: 10000, currentSavings: 2500, deadline: '2026-12-31', createdDate: '2026-01-15' },
    { id: '2', name: 'Emergency Fund', targetAmount: 15000, currentSavings: 8500, deadline: '2026-11-30', createdDate: '2026-02-01' },
    { id: '3', name: 'New Laptop', targetAmount: 2000, currentSavings: 1800, deadline: '2026-06-15', createdDate: '2026-03-01' },
  ])
  const [formData, setFormData] = useState({ goalName: '', targetAmount: '', deadline: '' })
  const [addMoneyGoalId, setAddMoneyGoalId] = useState<string | null>(null)

  const totalThisMonth = 450

  const calculateMonthlyNeeded = (goal: SavingsGoal): number => {
    const deadlineDate = new Date(goal.deadline)
    const today = new Date()
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
    const monthsNeeded = Math.ceil((goal.targetAmount - goal.currentSavings) / (totalThisMonth || 1))
    const projected = new Date()
    projected.setMonth(projected.getMonth() + monthsNeeded)
    return projected.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const topGoal = goals.length > 0
    ? goals
        .filter(g => g.currentSavings < g.targetAmount)
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0]
        ?? goals[0]
    : null

  const suggestion = topGoal
    ? `You need to save $${calculateMonthlyNeeded(topGoal).toFixed(2)}/month to reach "${topGoal.name}" by ${new Date(topGoal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'Create a savings goal to get personalized recommendations'

  const handleAddGoal = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.goalName.trim()) { alert('Please enter a goal name.'); return }
    if (!formData.targetAmount) { alert('Please enter a target amount.'); return }
    if (!formData.deadline) { alert('Please select a deadline.'); return }

    const newGoal: SavingsGoal = {
      id: String(Date.now()),
      name: formData.goalName.trim(),
      targetAmount: parseFloat(formData.targetAmount),
      currentSavings: 0,
      deadline: formData.deadline,
      createdDate: new Date().toISOString().split('T')[0],
    }
    setGoals(prev => [...prev, newGoal])
    setFormData({ goalName: '', targetAmount: '', deadline: '' })
  }

  const handleDeleteGoal = (id: string) => {
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

  return (
    <main>
      <div className="savings-goals-container">
        <PageHeader
          title="Smart Savings Goals"
          subtitle="Track and automate your savings targets"
        />

        {/* Smart Suggestion */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(46,125,50,0.08), rgba(76,175,80,0.08))',
          borderLeft: '4px solid var(--green-mid)', 
          borderRadius: '8px',
          padding: '1.25rem 1.5rem', 
          marginBottom: '2rem',
          border: '1px solid rgba(76,175,80,0.25)',
          animation: 'slideInUp 0.6s ease backwards', 
          animationDelay: '0.1s'
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--green-dark)', marginBottom: '0.4rem' }}>
            💡 Smart Suggestion
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--green-main)', margin: 0 }}>{suggestion}</p>
        </div>

        {/* Insights Strip */}
        <div className="summary-cards">
          <Card variant="stat" className="stat-card-income">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <div className="stat-label">This Month Saved</div>
              <div className="stat-value stat-value-saved">${totalThisMonth}</div>
            </div>
          </Card>

          <Card variant="stat" className="stat-card-rate">
            <div className="stat-icon">{goals.length > 0 && goals.every(g => isOnTrack(g)) ? '✅' : '❌'}</div>
            <div className="stat-info">
              <div className="stat-label">On Track</div>
              <div 
                className="stat-value stat-value-track"
                style={{
                  color: goals.length > 0 && goals.every(g => isOnTrack(g)) 
                    ? 'var(--green-main)' 
                    : 'var(--red-main)'
                }}
              >
                {goals.length > 0 && goals.every(g => isOnTrack(g)) ? 'Yes' : 'No'}
              </div>
            </div>
          </Card>

          <Card variant="stat" className="stat-card-savings">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-label">{topGoal ? 'Projected Completion' : 'Status'}</div>
              <div className="stat-value stat-value-Completion">{topGoal ? getProjectedCompletion(topGoal) : 'N/A'}</div>
            </div>
          </Card>
        </div>

        {/* Create Goal */}
        <CreateFormSection
          title="Create New Goal"
          onSubmit={handleAddGoal}
          submitLabel="Create Goal"
        >
          <FormField
            label="Goal Name"
            type="text"
            value={formData.goalName}
            onChange={(val) => setFormData({ ...formData, goalName: val })}
            placeholder="e.g., Vacation"
            required
          />

          <FormField
            label="Target Amount ($)"
            type="number"
            value={formData.targetAmount}
            onChange={(val) => setFormData({ ...formData, targetAmount: val })}
            placeholder="10000"
            required
          />

          <FormField
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(val) => setFormData({ ...formData, deadline: val })}
            required
          />
        </CreateFormSection>

        {/* Active Goals */}
        <div style={{ animation: 'slideInUp 0.6s ease backwards', animationDelay: '0.3s' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-dark)', fontWeight: 700 }}>
            Active Goals ({goals.length})
          </h2>

          {goals.length === 0 ? (
            <EmptyState
              icon="🎯"
              message="No savings goals yet. Create one to get started!"
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {goals.map(goal => {
                const progress = calculateProgress(goal)
                const monthlyNeeded = calculateMonthlyNeeded(goal)
                const onTrack = isOnTrack(goal)

                return (
                  <Card 
                    key={goal.id} 
                    style={{ padding: '1.5rem' }}
                    hover
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
                      <ProgressBar percentage={progress} reversed={true} />
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
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase' }}>
                          Monthly Target
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: onTrack ? 'var(--green-main)' : 'var(--red-main)' }}>
                          ${monthlyNeeded.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase' }}>
                          Status
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: onTrack ? 'var(--green-main)' : 'var(--red-main)' }}>
                          {onTrack ? '✓ On Track' : '⚠ Behind'}
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <Button variant="primary" onClick={() => setAddMoneyGoalId(goal.id)}>
                        Add Money
                      </Button>
                      <Button variant="ghost" onClick={() => handleDeleteGoal(goal.id)}>
                        Delete
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Money Modal */}
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

// Add Money Modal Component
const AddMoneyModal: FC<{
  goalName: string
  onClose: () => void
  onAdd: (amount: number) => void
}> = ({ goalName, onClose, onAdd }) => {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const n = parseFloat(amount)
    if (!n || n <= 0) { alert('Please enter a valid amount.'); return }
    onAdd(n)
  }

  return (
    <Modal isOpen onClose={onClose} title="Add Money">
      <p style={{ marginBottom: '1rem', color: 'var(--text-medium)', fontSize: '0.95rem' }}>
        Adding to: <strong>{goalName}</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <FormField
          label="Amount ($)"
          type="number"
          value={amount}
          onChange={setAmount}
          placeholder="0.00"
          min="0.01"
          step="0.01"
          required
        />

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button type="submit" variant="primary" style={{ flex: 2 }}>Add Money</Button>
          <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}

export default SavingsGoals