import { FC, useState, useEffect, FormEvent, useCallback } from 'react'
import { Transaction } from '../types'
import {
  PageHeader, Button, Modal,
  FormField, EmptyState
} from '../components/common'
import {
  TransactionTable, TransactionFilters,
  Pagination, TransactionsSummary
} from '../components/transactions'
import { useFilter, usePagination } from '../hooks'
import { transactionAPI } from '../utils/api'
import { ApiTransaction } from '../types/api'
import {
  getApiErrorMessage,
  mapTransactionFromApi,
  mapTransactionToApi,
} from '../utils/mappers'
import {
  TRANSACTION_CATEGORIES,
  categorySelectOptions,
} from '../constants/categories'
import '../styles/Transactions.css'

type FilterType = 'all' | 'income' | 'expense'
const ROWS_PER_PAGE = 5

const Transactions: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Food',
    amount: '',
    type: 'expense' as 'income' | 'expense',
  })

  const loadTransactions = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await transactionAPI.getUserTransactions()
      const list = (res.data.transactions as ApiTransaction[]).map(
        mapTransactionFromApi
      )
      setTransactions(list)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load transactions'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  useEffect(() => {
    if (showModal && editingTx) {
      setFormData({
        date: editingTx.date,
        description: editingTx.description,
        category: editingTx.category,
        amount: String(editingTx.amount),
        type: editingTx.type,
      })
    } else if (showModal) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'Food',
        amount: '',
        type: 'expense',
      })
    }
  }, [showModal, editingTx])

  const {
    filteredItems: filtered,
    filters,
    updateFilter,
  } = useFilter<Transaction>(transactions, (transaction, filterValues) => {
    const typeFilter = filterValues.filterType || 'all'
    if (typeFilter !== 'all' && transaction.type !== typeFilter) return false

    const categoryFilter = filterValues.filterCategory || 'all'
    if (
      categoryFilter !== 'all' &&
      transaction.category.toLowerCase() !== categoryFilter.toLowerCase()
    ) {
      return false
    }

    const dateFilter = filterValues.filterDate || ''
    if (dateFilter) {
      const txDate = new Date(transaction.date + 'T00:00:00')
      const filterDate = new Date(dateFilter + 'T00:00:00')
      if (txDate < filterDate) return false
    }

    return true
  })

  const sortedFiltered = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const {
    currentPage,
    totalPages,
    paginatedItems: pageData,
    setCurrentPage,
  } = usePagination(sortedFiltered, ROWS_PER_PAGE)

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpenses

  const openAdd = () => {
    setEditingTx(null)
    setShowModal(true)
  }
  const openEdit = (tx: Transaction) => {
    setEditingTx(tx)
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
    setEditingTx(null)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.description.trim()) {
      alert('Please enter a description.')
      return
    }
    const amt = parseFloat(formData.amount)
    if (!amt || amt <= 0) {
      alert('Please enter a valid amount.')
      return
    }

    setSaving(true)
    try {
      const payload = mapTransactionToApi({
        description: formData.description.trim(),
        amount: amt,
        category: formData.category,
        date: formData.date,
        type: formData.type,
      })

      if (editingTx) {
        await transactionAPI.updateTransaction(editingTx.id, payload)
      } else {
        await transactionAPI.createTransaction(payload)
      }
      await loadTransactions()
      closeModal()
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to save transaction'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return
    try {
      await transactionAPI.deleteTransaction(id)
      await loadTransactions()
    } catch (err) {
      alert(getApiErrorMessage(err, 'Failed to delete transaction'))
    }
  }

  const categoryFilterOptions = [
    { value: 'all', label: 'All Categories' },
    ...categorySelectOptions(TRANSACTION_CATEGORIES),
  ]

  if (loading) {
    return (
      <main>
        <div className="loading">Loading transactions...</div>
      </main>
    )
  }

  return (
    <main>
      <div className="transactions-container">
        <PageHeader
          title="Transactions"
          subtitle="View and manage all your income and expenses"
        />

        {error && <div className="auth-error-message">{error}</div>}

        <TransactionsSummary
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        <TransactionFilters
          filterDate={(filters.filterDate as string) || ''}
          filterCategory={(filters.filterCategory as string) || 'all'}
          filterType={(filters.filterType as FilterType) || 'all'}
          categoryOptions={categoryFilterOptions}
          onDateChange={val => updateFilter('filterDate', val)}
          onCategoryChange={val => updateFilter('filterCategory', val)}
          onTypeChange={val => updateFilter('filterType', val)}
          onApply={() => setCurrentPage(1)}
        />

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
            <TransactionTable
              transactions={pageData}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        <Button
          variant="primary"
          fullWidth
          onClick={openAdd}
          className="add-transaction-btn"
        >
          + Add New Transaction
        </Button>

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
              onChange={val => setFormData({ ...formData, date: val })}
              required
            />
            <FormField
              label="Description"
              type="text"
              value={formData.description}
              onChange={val => setFormData({ ...formData, description: val })}
              placeholder="e.g. Grocery shopping"
              required
            />
            <FormField
              label="Category"
              type="select"
              value={formData.category}
              onChange={val => setFormData({ ...formData, category: val })}
              options={categorySelectOptions(TRANSACTION_CATEGORIES)}
            />
            <div className="tx-type-toggle">
              <label className="tx-type-label">Type</label>
              <div className="tx-type-buttons">
                <button
                  type="button"
                  className={`tx-type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`tx-type-btn ${formData.type === 'income' ? 'active income' : ''}`}
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                >
                  Income
                </button>
              </div>
            </div>
            <FormField
              label="Amount ($)"
              type="number"
              value={formData.amount}
              onChange={val => setFormData({ ...formData, amount: val })}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button
                type="submit"
                variant="primary"
                loading={saving}
                className="modal-form-submit"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={closeModal}
                className="modal-form-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </main>
  )
}

export default Transactions
