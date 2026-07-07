import { Select } from '../ui/Select'
import { statusLabels, statusOptions } from '../../features/tasks/labels'
import type { TaskStatus } from '../../types'

interface TaskFiltersProps {
  status: TaskStatus | ''
  onStatusChange: (status: TaskStatus | '') => void
}

export function TaskFilters({ status, onStatusChange }: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">Status</span>
      <Select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as TaskStatus | '')
        }
        className="w-40"
      >
        <option value="">All</option>
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {statusLabels[option]}
          </option>
        ))}
      </Select>
    </div>
  )
}
