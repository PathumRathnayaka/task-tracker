import { api } from '../../lib/api'
import type {
  ApiResponse,
  PagedResponse,
  Task,
  TaskPayload,
  TaskStatus,
} from '../../types'

export interface TaskQuery {
  status?: TaskStatus
  ownerId?: number
  page?: number
  size?: number
}

export async function getTasks(
  query: TaskQuery = {},
): Promise<PagedResponse<Task>> {
  const { data } = await api.get<ApiResponse<PagedResponse<Task>>>('/tasks', {
    params: {
      status: query.status,
      ownerId: query.ownerId,
      page: query.page ?? 0,
      size: query.size ?? 8,
      sort: 'createdAt,desc',
    },
  })
  return data.data
}

export async function createTask(payload: TaskPayload): Promise<Task> {
  const { data } = await api.post<ApiResponse<Task>>('/tasks', payload)
  return data.data
}

export async function updateTask(
  id: number,
  payload: TaskPayload,
): Promise<Task> {
  const { data } = await api.put<ApiResponse<Task>>(`/tasks/${id}`, payload)
  return data.data
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`)
}
