import { FC, useState, useEffect } from 'react'

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
}

const Transactions: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    const mockTransactions: Transaction[] = [
      { id: '1', date: '2026-03-31', description: 'Salary Deposit', category: 'Income', amount: 4250, type: 'income' },
      { id: '2', date: '2026-03-30', description: 'Grocery Shopping', category: 'Food', amount: 125.50, type: 'expense' },
      { id: '3', date: '2026-03-28', description: 'Electric Bill', category: 'Utilities', amount: 89.99, type: 'expense' },
      { id: '4', date: '2026-03-27', description: 'Movie Tickets', category: 'Entertainment', amount: 30.00, type: 'expense' },
      { id: '5', date: '2026-03-26', description: 'Gas', category: 'Transport', amount: 52.00, type: 'expense' },
      { id: '6', date: '2026-03-25', description: 'Freelance Work', category: 'Income', amount: 500, type: 'income' },
      { id: '7', date: '2026-03-24', description: 'Restaurant', category: 'Food', amount: 65.75, type: 'expense' },
      { id: '8', date: '2026-03-23', description: 'Online Shopping', category: 'Shopping', amount: 120.00, type: 'expense' },
    ]

    setTransactions(mockTransactions)

    const income = mockTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = mockTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    setTotalIncome(income)
    setTotalExpenses(expenses)
  }, [])

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true
    return t.type === filterType
  })

  return (
    <main>
      <div className="transactions-container">
        <header>
          <h1>Transactions</h1>
          <p>View and manage all your income and expenses</p>
        </header>

        <div className="summary-cards">
          <div className="stat-card">
            <div className="stat-icon income">📈</div>
            <div className="stat-info">
              <div className="stat-label">Total Income</div>
              <div className="stat-value">${totalIncome.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card expense">
            <div className="stat-icon expense-icon">💸</div>
            <div className="stat-info">
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value">${totalExpenses.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon savings-icon">💰</div>
            <div className="stat-info">
              <div className="stat-label">Remaining Balance</div>
              <div className="stat-value">${(totalIncome - totalExpenses).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="filter-type">Filter By Type</label>
            <select
              id="filter-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
        </div>

        <div className="data-table-wrapper">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>Transaction History</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td className={`amount-${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: transaction.type === 'income' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 107, 107, 0.15)',
                      color: transaction.type === 'income' ? '#4CAF50' : '#FF6B6B',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default Transactions
