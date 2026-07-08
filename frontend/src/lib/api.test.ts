import { AxiosError } from 'axios'
import { extractErrorMessage } from './api'

describe('extractErrorMessage', () => {
  it('returns the first field error when validation details are present', () => {
    const error = new AxiosError('Request failed')
    error.response = {
      data: { message: 'Validation failed', errors: { title: 'Title is required' } },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    }
    expect(extractErrorMessage(error, 'fallback')).toBe('Title is required')
  })

  it('returns the response message when there are no field errors', () => {
    const error = new AxiosError('Request failed')
    error.response = {
      data: { message: 'User already exists' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    }
    expect(extractErrorMessage(error, 'fallback')).toBe('User already exists')
  })

  it('returns the fallback for a non-axios error', () => {
    expect(extractErrorMessage(new Error('boom'), 'Something went wrong')).toBe(
      'Something went wrong',
    )
  })
})
