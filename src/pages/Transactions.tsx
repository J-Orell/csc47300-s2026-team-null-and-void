import { FC, useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import { Transaction } from '../types'
import '../styles/Transactions.css'

type FilterType = 'all' | 'income' | 'expense'
type CategoryKey = 'income' | 'food' | 'utilities' | 'entertainment' | 'transport' | 'shopping'

const CATEGORY_CSS: Record<string, string> = {
  income:        'income-cat',
  food:          'food',
  utilities:     'utilities',
  entertainment: 'entertainment',
  transport:     'transport',
  shopping:      'shopping',
}

const ROWS_PER_PAGE = 5

const formatDate = (dateStr: string): string => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const d = new Date(dateStr + 'T00:00:00')
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}, ${d.getFullYear()}`
}

const formatNumber = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* ── Modal ── */
interface ModalProps {
  editingTx: Transaction | null
  onClose: () => void
  onSave: (tx: Omit<Transaction, 'id'> & { id?: string }) => void
}

const TransactionModal: FC<ModalProps> = ({ editingTx, onClose, onSave }) => {
  const [date, setDate]         = useState(editingTx?.date        ?? new Date().toISOString().split('T')[0])
  const [desc, setDesc]         = useState(editingTx?.description ?? '')
  const [category, setCategory] = useState(editingTx?.category    ?? 'food')
  const [amount, setAmount]     = useState(editingTx ? String(editingTx.amount) : '')

  const handleSave = () => {
    if (!desc.trim()) { alert('Please enter a description.'); return }
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { alert('Please enter a valid amount.'); return }
    const type: 'income' | 'expense' = category === 'income' ? 'income' : 'expense'
    onSave({ id: editingTx?.id, date, description: desc.trim(), category, amount: amt, type })
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-field">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Description</label>
          <input type="text" placeholder="e.g. Grocery shopping" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="income">Income</option>
            <option value="food">Food</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>
        <div className="modal-field">
          <label>Amount ($)</label>
          <input type="number" placeholder="0.00" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="modal-btns">
          <button className="btn-save" onClick={handleSave}>Save</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ── */
const Transactions: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading]           = useState(true)
  const [nextId, setNextId]             = useState(1)

  const [filterType,     setFilterType]     = useState<FilterType>('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterDate,     setFilterDate]     = useState('')

  const [currentPage,  setCurrentPage]  = useState(1)
  const [showModal,    setShowModal]    = useState(false)
  const [editingTx,    setEditingTx]    = useState<Transaction | null>(null)

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
      .catch(() => {
        setLoading(false)
      })
  }, [])

  /* Derived: filtered + sorted */
  const filtered = transactions
    .filter(t => filterType === 'all'     || t.type === filterType)
    .filter(t => filterCategory === 'all' || t.category.toLowerCase() === filterCategory)
    .filter(t => {
      if (!filterDate) return true
      return new Date(t.date + 'T00:00:00') >= new Date(filterDate + 'T00:00:00')
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const safePage   = Math.min(currentPage, totalPages)
  const pageData   = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE)

  /* Summary (based on ALL transactions, not filtered) */
  const totalIncome   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance       = totalIncome - totalExpenses

  /* CRUD */
  const openAdd  = () => { setEditingTx(null); setShowModal(true) }
  const openEdit = (tx: Transaction) => { setEditingTx(tx); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditingTx(null) }

  const handleSave = (data: Omit<Transaction,'id'> & { id?: string }) => {
    if (data.id) {
      setTransactions(prev => prev.map(t => t.id === data.id ? { ...t, ...data, id: t.id } : t))
    } else {
      const newTx: Transaction = { ...data, id: String(nextId) }
      setTransactions(prev => [...prev, newTx])
      setNextId(n => n + 1)
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    const tx = transactions.find(t => t.id === id)
    if (!tx) return
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleApplyFilter = () => setCurrentPage(1)

  if (loading) return <main><div className="loading">Loading transactions...</div></main>

  return (
    <main>
      <div className="transactions-container">
        <header>
          <h1>Transactions</h1>
          <p>View and manage all your income and expenses</p>
        </header>

        {/* Summary Cards */}
        <div className="summary-cards">
          <StatCard 
            icon="💵" 
            label="Total Income" 
            value={`$${formatNumber(totalIncome)}`} 
            type="income" 
          />
          <StatCard 
            icon="💸" 
            label="Total Expenses" 
            value={`$${formatNumber(totalExpenses)}`} 
            type="expense" 
          />
          <StatCard 
            icon="💳" 
            label="Remaining Balance" 
            value={`$${formatNumber(balance)}`} 
            type="savings" 
          />
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="filter-date">From Date</label>
            <input
              type="date"
              id="filter-date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="filter-category">Category</label>
            <select
              id="filter-category"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="income">Income</option>
              <option value="food">Food</option>
              <option value="utilities">Utilities</option>
              <option value="entertainment">Entertainment</option>
              <option value="transport">Transport</option>
              <option value="shopping">Shopping</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="filter-type">Type</label>
            <select
              id="filter-type"
              value={filterType}
              onChange={e => setFilterType(e.target.value as FilterType)}
            >
              <option value="all">All</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
          <button className="btn-filter" onClick={handleApplyFilter}>Apply</button>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>📄 No transactions found. Add one or adjust your filters!</p>
          </div>
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
                {pageData.map(tx => {
                  const catKey = tx.category.toLowerCase()
                  const badgeClass = CATEGORY_CSS[catKey] ?? 'other'
                  return (
                    <tr key={tx.id}>
                      <td style={{ color: 'var(--text-lighter)', fontSize: '0.88rem' }}>
                        {formatDate(tx.date)}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                        {tx.description}
                      </td>
                      <td>
                        <span className={`tx-category-badge ${badgeClass}`}>
                          {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                        </span>
                      </td>
                      <td className={`tx-amount-cell ${tx.type}`}>
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button className="icon-btn" title="Edit" onClick={() => openEdit(tx)}>✏️</button>
                        <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(tx.id)}>🗑</button>
                      </td>
                    </tr>
                  )
                })}
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

        <button className="add-transaction-btn" onClick={openAdd}>
          + Add New Transaction
        </button>

        {showModal && (
          <TransactionModal
            editingTx={editingTx}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
      </div>
    </main>
  )
}

export default Transactions