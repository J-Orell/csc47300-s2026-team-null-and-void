import { FC, useState, useEffect } from 'react'

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
    }
  ])

  const [formData, setFormData] = useState({
    goalName: '',
    targetAmount: '',
    deadline: ''
  })

  const [totalThisMonth, setTotalThisMonth] = useState(450)

  const calculateMonthlyNeeded = (goal: SavingsGoal): number => {
    const deadlineDate = new Date(goal.deadline)
    const today = new Date()
    const monthsRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)))
    const amountRemaining = Math.max(0, goal.targetAmount - goal.currentSavings)
    return Math.round((amountRemaining / monthsRemaining) * 100) / 100
  }

  const calculateProgress = (goal: SavingsGoal): number => {
    return Math.min(100, Math.round((goal.currentSavings / goal.targetAmount) * 100))
  }

  const isOnTrack = (goal: SavingsGoal): boolean => {
    const monthlyNeeded = calculateMonthlyNeeded(goal)
    return totalThisMonth >= monthlyNeeded
  }

  const getProjectedCompletion = (goal: SavingsGoal): string => {
    if (goal.currentSavings >= goal.targetAmount) {
      return 'Completed!'
    }
    const monthlyRate = totalThisMonth
    const amountRemaining = goal.targetAmount - goal.currentSavings
    const monthsNeeded = Math.ceil(amountRemaining / (monthlyRate || 1))
    const projectedDate = new Date()
    projectedDate.setMonth(projectedDate.getMonth() + monthsNeeded)
    return projectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const handleAddGoal = () => {
    if (formData.goalName && formData.targetAmount && formData.deadline) {
      const newGoal: SavingsGoal = {
        id: String(goals.length + 1),
        name: formData.goalName,
        targetAmount: parseFloat(formData.targetAmount),
        currentSavings: 0,
        deadline: formData.deadline,
        createdDate: new Date().toISOString().split('T')[0]
      }
      setGoals([...goals, newGoal])
      setFormData({ goalName: '', targetAmount: '', deadline: '' })
    }
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const handleAddMoney = (id: string) => {
    const amount = prompt('How much would you like to add?')
    if (amount) {
      const goalIndex = goals.findIndex(g => g.id === id)
      if (goalIndex !== -1) {
        const updatedGoals = [...goals]
        updatedGoals[goalIndex].currentSavings += parseFloat(amount)
        setGoals(updatedGoals)
      }
    }
  }

  const topGoal = goals.length > 0 ? goals.reduce((top, goal) => {
    const topProgress = calculateProgress(top)
    const goalProgress = calculateProgress(goal)
    return goalProgress > topProgress ? goal : top
  }) : null

  const suggestion = topGoal
    ? `You need to save $${calculateMonthlyNeeded(topGoal)}/month to reach "${topGoal.name}" by ${new Date(topGoal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'Create a savings goal to get personalized recommendations'

  return (
    <main>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header>
          <h1>Smart Savings Goals</h1>
          <p>Track and automate your savings targets</p>
        </header>

        {/* Create Goal Section */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-card)',
            animation: 'slideInUp 0.6s ease backwards'
          }}
        >
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#333', fontWeight: '700' }}>
            Create New Goal
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#666'
              }}>
                Goal Name
              </label>
              <input
                type="text"
                placeholder="e.g., Vacation"
                value={formData.goalName}
                onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
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
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#666'
              }}>
                Target Amount ($)
              </label>
              <input
                type="number"
                placeholder="10000"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
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
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#666'
              }}>
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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
                onClick={handleAddGoal}
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
                Create Goal
              </button>
            </div>
          </div>
        </div>

        {/* Smart Suggestion Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1), rgba(76, 175, 80, 0.1))',
            borderLeft: '4px solid #4caf50',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }}
        >
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1b5e20', marginBottom: '0.5rem' }}>
            💡 Smart Suggestion
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#2e7d32', margin: 0 }}>
            {suggestion}
          </p>
        </div>

        {/* Insights Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-card)'
          }}>
            <div className="stat-icon income" style={{
              fontSize: '2rem',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(76, 175, 80, 0.15)',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              💰
            </div>
            <div className="stat-label" style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#999',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              This Month Saved
            </div>
            <div className="stat-value" style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#4caf50'
            }}>
              ${totalThisMonth}
            </div>
          </div>

          <div className="stat-card" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-card)'
          }}>
            <div className="stat-icon income" style={{
              fontSize: '2rem',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(33, 150, 243, 0.15)',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              ✅
            </div>
            <div className="stat-label" style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#999',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              On Track
            </div>
            <div className="stat-value" style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: goals.length > 0 && goals.every(g => isOnTrack(g)) ? '#4caf50' : '#ff6b6b'
            }}>
              {goals.length > 0 && goals.every(g => isOnTrack(g)) ? 'Yes' : 'No'}
            </div>
          </div>

          <div className="stat-card" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-card)'
          }}>
            <div className="stat-icon income" style={{
              fontSize: '2rem',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 193, 7, 0.15)',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              📅
            </div>
            <div className="stat-label" style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#999',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              {topGoal ? 'Projected Completion' : 'Status'}
            </div>
            <div className="stat-value" style={{
              fontSize: '1.6rem',
              fontWeight: '700',
              color: '#ff9800'
            }}>
              {topGoal ? getProjectedCompletion(topGoal) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Active Goals Section */}
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#333', fontWeight: '700' }}>
            Active Goals ({goals.length})
          </h2>

          {goals.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-card)'
            }}>
              <p style={{ fontSize: '1rem', color: '#999', margin: 0 }}>
                No savings goals yet. Create one to get started! 🎯
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {goals.map(goal => {
                const progress = calculateProgress(goal)
                const monthlyNeeded = calculateMonthlyNeeded(goal)
                const onTrack = isOnTrack(goal)

                return (
                  <div
                    key={goal.id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border-card)',
                      transition: 'transform 0.2s',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#333', margin: '0 0 0.5rem 0' }}>
                        {goal.name}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#999', margin: 0 }}>
                        Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Amount Progress */}
                    <div style={{
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: '600', color: '#333' }}>Progress</span>
                        <span style={{ color: '#666' }}>
                          ${goal.currentSavings.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '5px',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: progress === 100 ? '#4caf50' : 'linear-gradient(90deg, #2e7d32, #4caf50)',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                        {progress}% complete
                      </div>
                    </div>

                    {/* Monthly Savings Info */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      background: onTrack ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      borderLeft: `4px solid ${onTrack ? '#4caf50' : '#ff6b6b'}`
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>
                          Monthly Target
                        </div>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: onTrack ? '#4caf50' : '#ff6b6b'
                        }}>
                          ${monthlyNeeded.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>
                          Status
                        </div>
                        <div style={{
                          fontSize: '0.95rem',
                          fontWeight: '700',
                          color: onTrack ? '#4caf50' : '#ff6b6b'
                        }}>
                          {onTrack ? '✓ On Track' : '⚠ Behind'}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleAddMoney(goal.id)}
                        style={{
                          padding: '0.75rem',
                          background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Add Money
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        style={{
                          padding: '0.75rem',
                          background: '#f5f5f5',
                          color: '#333',
                          border: '1px solid #e9ecef',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default SavingsGoals
