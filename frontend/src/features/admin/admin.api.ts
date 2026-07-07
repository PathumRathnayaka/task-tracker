import { api } from '../../lib/api'
import type { ApiResponse, UserSummary } from '../../types'

export async function getUsers(): Promise<UserSummary[]> {
  const { data } = await api.get<ApiResponse<UserSummary[]>>('/admin/users')
  return data.data
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`)
}
