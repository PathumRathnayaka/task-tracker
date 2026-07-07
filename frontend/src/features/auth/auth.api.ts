import { api } from '../../lib/api'
import type {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../../types'

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    payload,
  )
  return data.data
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    payload,
  )
  return data.data
}
