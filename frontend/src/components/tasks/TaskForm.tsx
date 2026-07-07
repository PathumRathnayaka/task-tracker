import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import {
  priorityLabels,
  priorityOptions,
  statusLabels,
  statusOptions,
} from '../../features/tasks/labels'
import {
  taskSchema,
  type TaskFormValues,
} from '../../features/tasks/task.schema'
import { Priority, TaskStatus } from '../../types'
import type { Task, TaskPayload } from '../../types'

interface TaskFormProps {
  task?: Task | null
  submitting?: boolean
  onSubmit: (payload: TaskPayload) => void
  onCancel: () => void
}

function toInputDate(value: string | null | undefined): string {
  if (!value) return ''
  return value.slice(0, 16)
}

export function TaskForm({ task, submitting, onSubmit, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? TaskStatus.TODO,
      priority: task?.priority ?? Priority.MEDIUM,
      dueDate: toInputDate(task?.dueDate),
    },
  })

  const submit = (values: TaskFormValues) => {
    onSubmit({
      title: values.title,
      description: values.description?.trim() ? values.description : null,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate ? values.dueDate : null,
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <Field label="Title" htmlFor="title" error={errors.title?.message}>
        <Input id="title" invalid={!!errors.title} {...register('title')} />
      </Field>
      <Field
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
      >
        <Textarea id="description" rows={3} {...register('description')} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Status" htmlFor="status">
          <Select id="status" {...register('status')}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {statusLabels[option]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Priority" htmlFor="priority">
          <Select id="priority" {...register('priority')}>
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {priorityLabels[option]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Due date" htmlFor="dueDate">
        <Input id="dueDate" type="datetime-local" {...register('dueDate')} />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {task ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  )
}
