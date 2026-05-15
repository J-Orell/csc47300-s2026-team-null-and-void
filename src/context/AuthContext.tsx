import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface AuthUser {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
}

interface AuthContextValue {
  isLoggedIn: boolean
  isAdmin: boolean
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('authToken')
  )
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const login = useCallback((token: string, nextUser: AuthUser) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(nextUser))
    setIsLoggedIn(true)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
  }, [])

  useEffect(() => {
    const onUnauthorized = () => logout()
    window.addEventListener('auth:unauthorized', onUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized)
  }, [logout])

  const isAdmin = user?.role === 'admin'

  const value = useMemo(
    () => ({ isLoggedIn, isAdmin, user, login, logout }),
    [isLoggedIn, isAdmin, user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
