import { FC, useState, FormEvent } from 'react'
import {
  PageHeader, Button, Modal,
  FormField, EmptyState, CreateFormSection
} from '../components/common'
import { GoalCard, SavingsSummary } from '../components/savings'
import { useLocalStorage } from '../hooks'
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
  // Uses hook for persistent storage
  const [goals, setGoals] = useLocalStorage<SavingsGoal[]>('savings-goals', [
    {
      id: '1',
      name: 'Vacation to Hawaii',
      targetAmount: 10000,
      currentSavings: 2500,
      deadline: '2026-12-31',
      createdDate: '2026-01-15'
    },
    {
      id: '2',
      name: 'Emergency Fund',
      targetAmount: 15000,
      currentSavings: 8500,
      deadline: '2026-11-30',
      createdDate: '2026-02-01'
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 2000,
      currentSavings: 1800,
      deadline: '2026-06-15',
      createdDate: '2026-03-01'
    },
  ])

  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    deadline: ''
  })

  const [addMoneyGoalId, setAddMoneyGoalId] = useState<string | null>(null)
  const totalThisMonth = 450

  const calculateMonthlyNeeded = (goal: SavingsGoal): number => {
    const deadlineDate = new Date(goal.deadline)
    const today = new Date()
    const monthsRemaining = Math.max(
      1,
      Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30))
    )
    const amountRemaining = Math.max(0, goal.targetAmount - goal.currentSavings)
    return Math.round((amountRemaining / monthsRemaining) * 100) / 100
  }

  const isOnTrack = (goal: SavingsGoal): boolean =>
    totalThisMonth >= calculateMonthlyNeeded(goal)

  const getProjectedCompletion = (goal: SavingsGoal): string => {
    if (goal.currentSavings >= goal.targetAmount) return 'Completed!'
    const monthsNeeded = Math.ceil((goal.targetAmount - goal.currentSavings) / (totalThisMonth || 1))
    const projected = new Date()
    projected.setMonth(projected.getMonth() + monthsNeeded)
    return projected.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  // Get the highest priority goal (earliest deadline, not yet completed)
  const topGoal = goals.length > 0
    ? goals
      .filter(g => g.currentSavings < g.targetAmount)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0]
      ?? goals[0]
    : null

  const suggestion = topGoal
    ? `You need to save $${calculateMonthlyNeeded(topGoal).toFixed(2)}/month to reach "${topGoal.name}" by ${new Date(topGoal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'Create a savings goal to get personalized recommendations'

  const allGoalsOnTrack = goals.length > 0 && goals.every(g => isOnTrack(g))

  const handleAddGoal = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.goalName.trim()) {
      alert('Please enter a goal name.')
      return
    }
    if (!formData.targetAmount) {
      alert('Please enter a target amount.')
      return
    }
    if (!formData.deadline) {
      alert('Please select a deadline.')
      return
    }

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

        <div className="smart-suggestion">
          <h3 className="smart-suggestion-title">💡 Smart Suggestion</h3>
          <p className="smart-suggestion-text">{suggestion}</p>
        </div>

        <SavingsSummary
          totalSavedThisMonth={totalThisMonth}
          isOnTrack={allGoalsOnTrack}
          projectedCompletion={topGoal ? getProjectedCompletion(topGoal) : 'N/A'}
        />

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
          <h2 className="goals-section-title">Active Goals ({goals.length})</h2>
          {goals.length === 0 ? (
            <EmptyState
              icon="🎯"
              message="No savings goals yet. Create one to get started!"
            />
          ) : (
            <div className="goals-grid">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  id={goal.id}
                  name={goal.name}
                  targetAmount={goal.targetAmount}
                  currentSavings={goal.currentSavings}
                  deadline={goal.deadline}
                  monthlyNeeded={calculateMonthlyNeeded(goal)}
                  isOnTrack={isOnTrack(goal)}
                  projectedCompletion={getProjectedCompletion(goal)}
                  onAddMoney={() => setAddMoneyGoalId(goal.id)}
                  onDelete={() => handleDeleteGoal(goal.id)}
                />
              ))}
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
    if (!n || n <= 0) {
      alert('Please enter a valid amount.')
      return
    }
    onAdd(n)
  }

  return (
    <Modal isOpen onClose={onClose} title="Add Money">
      <p className="add-money-description">
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
        <div className="add-money-actions">
          <Button type="submit" variant="primary" className="add-money-submit">Add Money</Button>
          <Button type="button" variant="secondary" onClick={onClose} className="add-money-cancel">Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}

export default SavingsGoals