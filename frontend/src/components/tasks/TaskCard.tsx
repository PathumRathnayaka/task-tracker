import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import {
  priorityLabels,
  priorityStyles,
  statusLabels,
  statusStyles,
} from '../../features/tasks/labels'
import type { Task } from '../../types'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

function formatDate(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const due = formatDate(task.dueDate)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{task.title}</h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button variant="ghost" onClick={() => onDelete(task)}>
            Delete
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge className={statusStyles[task.status]}>
          {statusLabels[task.status]}
        </Badge>
        <Badge className={priorityStyles[task.priority]}>
          {priorityLabels[task.priority]}
        </Badge>
        {due && (
          <span className="text-xs text-slate-400">Due {due}</span>
        )}
      </div>
    </div>
  )
}
