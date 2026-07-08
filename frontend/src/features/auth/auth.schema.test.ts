import { loginSchema, registerSchema } from './auth.schema'

describe('loginSchema', () => {
  it('accepts a username and password', () => {
    const result = loginSchema.safeParse({ username: 'bob', password: 'secret' })
    expect(result.success).toBe(true)
  })

  it('rejects an empty username', () => {
    const result = loginSchema.safeParse({ username: '', password: 'secret' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Username is required')
    }
  })
})

describe('registerSchema', () => {
  it('accepts a valid registration', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      email: 'alice@example.com',
      password: 'password',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a short username', () => {
    const result = registerSchema.safeParse({
      username: 'al',
      email: 'alice@example.com',
      password: 'password',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      email: 'not-an-email',
      password: 'password',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a password shorter than six characters', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      email: 'alice@example.com',
      password: '123',
    })
    expect(result.success).toBe(false)
  })
})
