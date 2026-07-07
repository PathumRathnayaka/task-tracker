import { z } from 'zod'
import { Priority, TaskStatus } from '../../types'

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
  dueDate: z.string().optional(),
})

export type TaskFormValues = z.infer<typeof taskSchema>
