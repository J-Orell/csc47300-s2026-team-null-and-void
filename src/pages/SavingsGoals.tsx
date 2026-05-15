import { FC, useState, FormEvent, useCallback, useEffect } from 'react'
import {
  PageHeader, Button, Modal,
  FormField, EmptyState, CreateFormSection
} from '../components/common'
import { GoalCard, SavingsSummary } from '../components/savings'
import { savingsGoalAPI } from '../utils/api'
import { ApiSavingsGoal } from '../types/api'
import {
  getApiErrorMessage,
  mapSavingsGoalFromApi,
  SavingsGoalUi,
} from '../utils/mappers'
import '../styles/SavingsGoals.css'

const SavingsGoals: FC = () => {
  const [goals, setGoals] = useState<SavingsGoalUi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    deadline: '',
  })
  const [addMoneyGoalId, setAddMoneyGoalId] = useState<string | null>(null)

  const loadGoals = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await savingsGoalAPI.getUserGoals()
      const list = (res.data.goals as ApiSavingsGoal[]).map(mapSavingsGoalFromApi)
      setGoals(list)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load savings goals'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  const calculateMonthlyNeeded = (goal: SavingsGoalUi): number => {
    const deadlineDate = new Date(goal.deadline)
    const today = new Date()
    const monthsRemaining = Math.max(
      1,
      Math.ceil(
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)
      )
    )
    const amountRemaining = Math.max(0, goal.targetAmount - goal.currentSavings)
    return Math.round((amountRemaining / monthsRemaining) * 100) / 100
  }

  const totalThisMonth = goals.reduce((sum, g) => {
    const created = new Date(g.createdDate)
    const now = new Date()
    if (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    ) {
      return sum + g.currentSavings
    }
    return sum
  }, 0)

  const isOnTrack = (goal: SavingsGoalUi): boolean =>
    totalThisMonth >= calculateMonthlyNeeded(goal)

  const getProjectedCompletion = (goal: SavingsGoalUi): string => {
    if (goal.currentSavings >= goal.targetAmount) return 'Completed!'
    const monthsNeeded = Math.ceil(
      (goal.targetAmount - goal.currentSavings) / (totalThisMonth || 1)
    )
    const projected = new Date()
    projected.setMonth(projected.getMonth() + monthsNeeded)
    return projected.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const topGoal =
    goals.length > 0
      ? goals
          .filter(g => g.currentSavings < g.targetAmount)
          .sort(
            (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          )[0] ?? goals[0]
      : null

  const suggestion = topGoal
    ? `You need to save $${calculateMonthlyNeeded(topGoal).toFixed(2)}/month to reach "${topGoal.name}" by ${new Date(topGoal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'Create a savings goal to get personalized recommendations'

  const allGoalsOnTrack = goals.length > 0 && goals.every(g => isOnTrack(g))

  const handleAddGoal = async (e: FormEvent) => {
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

    setSaving(true)
    try {
      await savingsGoalAPI.createGoal({
        name: formData.goalName.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline,
      })
      await loadGoals()
      setFormData({ goalName: '', targetAmount: '', deadline: '' })
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to create goal'))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGoal = async (id: string) => {
    if (!window.confirm('Delete this savings goal?')) return
    try {
      await savingsGoalAPI.deleteGoal(id)
      await loadGoals()
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to delete goal'))
    }
  }

  const handleAddMoney = async (amount: number) => {
    if (!addMoneyGoalId) return
    try {
      await savingsGoalAPI.addToGoal(addMoneyGoalId, amount)
      await loadGoals()
      setAddMoneyGoalId(null)
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to add money'))
    }
  }

  const addMoneyGoal = goals.find(g => g.id === addMoneyGoalId) ?? null

  if (loading) {
    return (
      <main>
        <div className="loading">Loading savings goals...</div>
      </main>
    )
  }

  return (
    <main>
      <div className="savings-goals-container">
        <PageHeader
          title="Smart Savings Goals"
          subtitle="Track and automate your savings targets"
        />

        {error && <div className="auth-error-message">{error}</div>}

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
          submitLabel={saving ? 'Creating...' : 'Create Goal'}
        >
          <FormField
            label="Goal Name"
            type="text"
            value={formData.goalName}
            onChange={val => setFormData({ ...formData, goalName: val })}
            placeholder="e.g., Vacation"
            required
          />
          <FormField
            label="Target Amount ($)"
            type="number"
            value={formData.targetAmount}
            onChange={val => setFormData({ ...formData, targetAmount: val })}
            placeholder="10000"
            required
          />
          <FormField
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={val => setFormData({ ...formData, deadline: val })}
            required
          />
        </CreateFormSection>

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
          <Button type="submit" variant="primary" className="add-money-submit">
            Add Money
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="add-money-cancel">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SavingsGoals
