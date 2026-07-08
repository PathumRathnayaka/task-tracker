import { clearSession, getStoredUser, getToken, saveSession } from './storage'
import type { AuthResponse } from '../types'

const auth: AuthResponse = {
  accessToken: 'token-123',
  tokenType: 'Bearer',
  username: 'bob',
  email: 'bob@example.com',
  roles: ['ROLE_USER'],
}

describe('session storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists the token and user on save', () => {
    saveSession(auth)
    expect(getToken()).toBe('token-123')
    expect(getStoredUser()).toEqual({
      username: 'bob',
      email: 'bob@example.com',
      roles: ['ROLE_USER'],
    })
  })

  it('removes the token and user on clear', () => {
    saveSession(auth)
    clearSession()
    expect(getToken()).toBeNull()
    expect(getStoredUser()).toBeNull()
  })

  it('returns null when the stored user is malformed', () => {
    localStorage.setItem('tt.user', '{ not json')
    expect(getStoredUser()).toBeNull()
  })
})
