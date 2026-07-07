import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  clearSession,
  getStoredUser,
  saveSession,
  type StoredUser,
} from '../../lib/storage'
import type { LoginPayload, RegisterPayload } from '../../types'
import * as authApi from './auth.api'
import { AuthContext, type AuthContextValue } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.roles.includes('ROLE_ADMIN') ?? false,
      login: async (payload: LoginPayload) => {
        const auth = await authApi.login(payload)
        saveSession(auth)
        setUser({
          username: auth.username,
          email: auth.email,
          roles: auth.roles ?? [],
        })
      },
      register: async (payload: RegisterPayload) => {
        const auth = await authApi.register(payload)
        saveSession(auth)
        setUser({
          username: auth.username,
          email: auth.email,
          roles: auth.roles ?? [],
        })
      },
      logout: () => {
        clearSession()
        setUser(null)
      },
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
