import { FC, useState, useEffect, FormEvent } from 'react'
import { Transaction } from '../types'
import { 
  Card, 
  PageHeader, 
  Button, 
  Modal, 
  FormField, 
  EmptyState,
  IconButton,
  Badge
} from '../components/common'
import '../styles/Transactions.css'

type FilterType = 'all' | 'income' | 'expense'

const ROWS_PER_PAGE = 5

const formatDate = (dateStr: string): string => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const d = new Date(dateStr + 'T00:00:00')
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}, ${d.getFullYear()}`
}

const formatNumber = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const Transactions: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [nextId, setNextId] = useState(1)
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'food',
    amount: ''
  })

  /* Load from JSON */
  useEffect(() => {
    fetch('/data/transactions-data.json')
      .then(r => r.json())
      .then((data: Transaction[]) => {
        setTransactions(data)
        const maxId = data.reduce((m, t) => Math.max(m, parseInt(t.id) || 0), 0)
        setNextId(maxId + 1)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showModal && editingTx) {
      setFormData({
        date: editingTx.date,
        description: editingTx.description,
        category: editingTx.category,
        amount: String(editingTx.amount)
      })
    } else if (showModal) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'food',
        amount: ''
      })
    }
  }, [showModal, editingTx])

  /* Derived: filtered + sorted */
  const filtered = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => filterCategory === 'all' || t.category.toLowerCase() === filterCategory)
    .filter(t => {
      if (!filterDate) return true
      return new Date(t.date + 'T00:00:00') >= new Date(filterDate + 'T00:00:00')
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const pageData = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE)

  /* Summary */
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpenses

  /* CRUD */
  const openAdd = () => { setEditingTx(null); setShowModal(true) }
  const openEdit = (tx: Transaction) => { setEditingTx(tx); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditingTx(null) }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.description.trim()) { alert('Please enter a description.'); return }
    const amt = parseFloat(formData.amount)
    if (!amt || amt <= 0) { alert('Please enter a valid amount.'); return }

    const type: 'income' | 'expense' = formData.category === 'income' ? 'income' : 'expense'

    if (editingTx) {
      setTransactions(prev => prev.map(t => 
        t.id === editingTx.id 
          ? { ...t, date: formData.date, description: formData.description, category: formData.category, amount: amt, type }
          : t
      ))
    } else {
      const newTx: Transaction = {
        id: String(nextId),
        date: formData.date,
        description: formData.description,
        category: formData.category,
        amount: amt,
        type
      }
      setTransactions(prev => [...prev, newTx])
      setNextId(n => n + 1)
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleApplyFilter = () => setCurrentPage(1)

  if (loading) return <main><div className="loading">Loading transactions...</div></main>

  return (
    <main>
      <div className="transactions-container">
        <PageHeader
          title="Transactions"
          subtitle="View and manage all your income and expenses"
        />

        {/* Summary Cards */}
        <div className="summary-cards">
          <Card variant="stat" className="stat-card-income">
            <div className="stat-icon">💵</div>
            <div className="stat-info">
              <div className="stat-label">Total Income</div>
              <div className="stat-value">${formatNumber(totalIncome)}</div>
            </div>
          </Card>

          <Card variant="stat" className="stat-card-expense">
            <div className="stat-icon">💸</div>
            <div className="stat-info">
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value">${formatNumber(totalExpenses)}</div>
            </div>
          </Card>

          <Card variant="stat" className="stat-card-savings">
            <div className="stat-icon">💳</div>
            <div className="stat-info">
              <div className="stat-label">Remaining Balance</div>
              <div className="stat-value">${formatNumber(balance)}</div>
            </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <FormField
            label="From Date"
            type="date"
            value={filterDate}
            onChange={setFilterDate}
          />

          <FormField
            label="Category"
            type="select"
            value={filterCategory}
            onChange={setFilterCategory}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'income', label: 'Income' },
              { value: 'food', label: 'Food' },
              { value: 'utilities', label: 'Utilities' },
              { value: 'entertainment', label: 'Entertainment' },
              { value: 'transport', label: 'Transport' },
              { value: 'shopping', label: 'Shopping' }
            ]}
          />

          <FormField
            label="Type"
            type="select"
            value={filterType}
            onChange={(val) => setFilterType(val as FilterType)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'income', label: 'Income Only' },
              { value: 'expense', label: 'Expenses Only' }
            ]}
          />

          <Button variant="filter" onClick={handleApplyFilter}>Apply</Button>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="📄"
            message="No transactions found. Add one or adjust your filters!"
          />
        ) : (
          <div className="data-table-wrapper">
            <div className="table-top-bar">
              <h2>Transaction History</h2>
              <span className="transaction-count">
                Showing {pageData.length} of {filtered.length} transactions
              </span>
            </div>

            <table className="transactions-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ color: 'var(--text-lighter)', fontSize: '0.88rem' }}>
                      {formatDate(tx.date)}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                      {tx.description}
                    </td>
                    <td>
                      <Badge variant="category" className={`badge-${tx.category.toLowerCase()}`}>
                        {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                      </Badge>
                    </td>
                    <td className={`tx-amount-cell ${tx.type}`}>
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <IconButton icon="✏️" label="Edit" onClick={() => openEdit(tx)} />
                      <IconButton icon="🗑" label="Delete" variant="danger" onClick={() => handleDelete(tx.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`page-btn${p === safePage ? ' active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >{p}</button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >›</button>
              </div>
            )}
          </div>
        )}

        <Button variant="primary" fullWidth onClick={openAdd} style={{ marginTop: '1.5rem' }}>
          + Add New Transaction
        </Button>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={editingTx ? 'Edit Transaction' : 'Add Transaction'}
        >
          <form onSubmit={handleSave}>
            <FormField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(val) => setFormData({ ...formData, date: val })}
              required
            />

            <FormField
              label="Description"
              type="text"
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
              placeholder="e.g. Grocery shopping"
              required
            />

            <FormField
              label="Category"
              type="select"
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              options={[
                { value: 'income', label: 'Income' },
                { value: 'food', label: 'Food' },
                { value: 'utilities', label: 'Utilities' },
                { value: 'entertainment', label: 'Entertainment' },
                { value: 'transport', label: 'Transport' },
                { value: 'shopping', label: 'Shopping' }
              ]}
            />

            <FormField
              label="Amount ($)"
              type="number"
              value={formData.amount}
              onChange={(val) => setFormData({ ...formData, amount: val })}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button type="submit" variant="primary" style={{ flex: 2 }}>Save</Button>
              <Button type="button" variant="secondary" onClick={closeModal} style={{ flex: 1 }}>Cancel</Button>
            </div>
          </form>
        </Modal>
      </div>
    </main>
  )
}

export default Transactions