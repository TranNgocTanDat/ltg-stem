import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  apiErrorMessage,
  clearTokens,
  hasAccessToken,
  lmsApi,
  resultOf,
  saveTokens,
} from './lms-api'
import type { User } from './lms-types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchMe = useCallback(async () => {
    if (!hasAccessToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const res = await lmsApi.get('/auth/me')
      setUser(resultOf<User>(res.data))
    } catch {
      clearTokens()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  useEffect(() => {
    const onLogout = () => {
      setUser(null)
      navigate('/lms/login', { replace: true })
    }
    window.addEventListener('lms-logout', onLogout)
    return () => window.removeEventListener('lms-logout', onLogout)
  }, [navigate])

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await lmsApi.post('/auth/login', { email, password })
        const data = resultOf<{
          token: string
          refreshToken: string
          user: User
        }>(res.data)
        saveTokens(data.token, data.refreshToken)
        setUser(data.user)
      } catch (e) {
        throw new Error(apiErrorMessage(e))
      }
    },
    [],
  )

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    navigate('/lms/login', { replace: true })
  }, [navigate])

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshMe: fetchMe }),
    [user, loading, login, logout, fetchMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải dùng bên trong AuthProvider')
  return ctx
}
