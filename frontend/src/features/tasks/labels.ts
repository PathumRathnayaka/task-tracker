import { Priority, TaskStatus } from '../../types'

export const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To do',
  [TaskStatus.IN_PROGRESS]: 'In progress',
  [TaskStatus.DONE]: 'Done',
}

export const priorityLabels: Record<Priority, string> = {
  [Priority.LOW]: 'Low',
  [Priority.MEDIUM]: 'Medium',
  [Priority.HIGH]: 'High',
}

export const statusStyles: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-slate-100 text-slate-700',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
  [TaskStatus.DONE]: 'bg-green-100 text-green-700',
}

export const priorityStyles: Record<Priority, string> = {
  [Priority.LOW]: 'bg-slate-100 text-slate-600',
  [Priority.MEDIUM]: 'bg-amber-100 text-amber-700',
  [Priority.HIGH]: 'bg-red-100 text-red-700',
}

export const statusOptions = Object.values(TaskStatus)
export const priorityOptions = Object.values(Priority)
