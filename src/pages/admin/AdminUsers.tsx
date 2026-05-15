import { FC, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Button, Badge } from '../../components/common'
import { userAPI } from '../../utils/api'
import { ApiUser } from '../../types/api'
import '../../styles/Admin.css'

const AdminUsers: FC = () => {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await userAPI.getAllUsers()
      setUsers(res.data.users ?? [])
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined
      setError(message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleRoleChange = async (user: ApiUser, role: 'user' | 'admin') => {
    try {
      await userAPI.updateUserRole(user._id, role)
      setUsers(prev =>
        prev.map(u => (u._id === user._id ? { ...u, role } : u))
      )
    } catch {
      alert('Failed to update role')
    }
  }

  const handleDelete = async (user: ApiUser) => {
    if (!window.confirm(`Delete user ${user.email}? This cannot be undone.`)) return
    try {
      await userAPI.deleteUser(user._id)
      setUsers(prev => prev.filter(u => u._id !== user._id))
    } catch {
      alert('Failed to delete user')
    }
  }

  if (loading) {
    return (
      <main className="admin-page">
        <div className="loading">Loading users...</div>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <PageHeader
        title="Admin — Users"
        subtitle="Manage accounts, roles, and drill into user activity"
      />

      <div className="admin-toolbar">
        <p>{users.length} registered users</p>
        <Button variant="secondary" onClick={loadUsers}>
          Refresh
        </Button>
      </div>

      {error && <div className="auth-error-message">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <Link className="admin-link" to={`/admin/users/${user._id}`}>
                    {user.firstName || user.lastName
                      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                      : user.username}
                  </Link>
                </td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <Badge variant={user.role === 'admin' ? 'info' : 'category'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="admin-actions">
                  <select
                    value={user.role}
                    onChange={e =>
                      handleRoleChange(user, e.target.value as 'user' | 'admin')
                    }
                    aria-label={`Role for ${user.email}`}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <Link className="admin-link" to={`/admin/users/${user._id}`}>
                    View
                  </Link>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default AdminUsers
