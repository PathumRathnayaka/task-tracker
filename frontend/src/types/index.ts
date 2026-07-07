export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const

export type Priority = (typeof Priority)[keyof typeof Priority]

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  username: string
  email: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  dueDate: string | null
  createdAt: string
  updatedAt: string
  userId: number
}

export interface TaskPayload {
  title: string
  description?: string | null
  status: TaskStatus
  priority: Priority
  dueDate?: string | null
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface UserSummary {
  id: number
  username: string
  email: string
  enabled: boolean
  roles: string[]
  createdAt: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface LoginPayload {
  username: string
  password: string
}
