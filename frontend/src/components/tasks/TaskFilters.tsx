import { Select } from '../ui/Select'
import { statusLabels, statusOptions } from '../../features/tasks/labels'
import type { TaskStatus, UserSummary } from '../../types'

interface TaskFiltersProps {
  status: TaskStatus | ''
  onStatusChange: (status: TaskStatus | '') => void
  owners?: UserSummary[]
  ownerId?: number | ''
  onOwnerChange?: (ownerId: number | '') => void
}

export function TaskFilters({
  status,
  onStatusChange,
  owners,
  ownerId,
  onOwnerChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
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

      {owners && onOwnerChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Owner</span>
          <Select
            value={ownerId ?? ''}
            onChange={(event) =>
              onOwnerChange(
                event.target.value ? Number(event.target.value) : '',
              )
            }
            className="w-48"
          >
            <option value="">Everyone</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.username}
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  )
}
