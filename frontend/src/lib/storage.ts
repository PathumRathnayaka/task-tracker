import type { AuthResponse } from '../types'

const TOKEN_KEY = 'tt.token'
const USER_KEY = 'tt.user'

export interface StoredUser {
  username: string
  email: string
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

export function saveSession(auth: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, auth.accessToken)
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ username: auth.username, email: auth.email }),
  )
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
