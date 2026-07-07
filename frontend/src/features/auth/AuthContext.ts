import { createContext } from 'react'
import type { StoredUser } from '../../lib/storage'
import type { LoginPayload, RegisterPayload } from '../../types'

export interface AuthContextValue {
  user: StoredUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
