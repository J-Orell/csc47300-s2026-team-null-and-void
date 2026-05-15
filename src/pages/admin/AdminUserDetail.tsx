import { FC, useCallback, useEffect, useState, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader, Button, Badge } from '../../components/common'
import { userAPI, transactionAPI } from '../../utils/api'
import { ApiUser, ApiTransaction } from '../../types/api'
import '../../styles/Admin.css'

const AdminUserDetail: FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<ApiUser | null>(null)
  const [transactions, setTransactions] = useState<ApiTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: 'user' as 'user' | 'admin',
  })

  const loadData = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const [userRes, txRes] = await Promise.all([
        userAPI.getUserById(userId),
        transactionAPI.getTransactionsByUserId(userId),
      ])
      const u = userRes.data.user as ApiUser
      setUser(u)
      setForm({
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        username: u.username,
        email: u.email,
        role: u.role,
      })
      setTransactions(txRes.data.transactions ?? [])
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined
      setError(message || 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    try {
      const res = await userAPI.updateUser(userId, form)
      setUser(res.data.user)
      alert('User updated')
    } catch {
      alert('Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!userId || !user) return
    if (!window.confirm(`Delete ${user.email}?`)) return
    try {
      await userAPI.deleteUser(userId)
      navigate('/admin/users', { replace: true })
    } catch {
      alert('Failed to delete user')
    }
  }

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  if (loading) {
    return (
      <main className="admin-page">
        <div className="loading">Loading user...</div>
      </main>
    )
  }

  if (error || !user) {
    return (
      <main className="admin-page">
        <p className="auth-error-message">{error || 'User not found'}</p>
        <Link className="admin-link" to="/admin/users">
          ← Back to users
        </Link>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <div className="admin-breadcrumb">
        <Link to="/admin/users">Users</Link> / {user.username}
      </div>

      <PageHeader
        title={`${form.firstName} ${form.lastName}`.trim() || user.username}
        subtitle={`User ID: ${user._id}`}
      />

      <div className="admin-detail-grid">
        <section className="admin-card">
          <h3>Profile</h3>
          <dl className="admin-meta">
            <dt>Joined</dt>
            <dd>{user.createdAt ? formatDate(user.createdAt) : '—'}</dd>
            <dt>Status</dt>
            <dd>
              <Badge variant={user.isActive === false ? 'danger' : 'success'}>
                {user.isActive === false ? 'Inactive' : 'Active'}
              </Badge>
            </dd>
          </dl>
        </section>

        <section className="admin-card">
          <h3>Edit user</h3>
          <form onSubmit={handleSave}>
            <div className="admin-field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={form.role}
                onChange={e =>
                  setForm({ ...form, role: e.target.value as 'user' | 'admin' })
                }
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="detail-actions">
              <Button type="submit" variant="primary" loading={saving}>
                Save changes
              </Button>
              <Button type="button" variant="danger" onClick={handleDelete}>
                Delete user
              </Button>
            </div>
          </form>
        </section>
      </div>

      <section className="admin-card">
        <h3>Transaction history ({transactions.length})</h3>
        {transactions.length === 0 ? (
          <p>No transactions for this user.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx._id}>
                    <td>{formatDate(tx.date)}</td>
                    <td>{tx.description}</td>
                    <td>{tx.category}</td>
                    <td className={tx.type}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td>
                      <Link
                        className="admin-link"
                        to={`/transactions/${tx._id}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminUserDetail
