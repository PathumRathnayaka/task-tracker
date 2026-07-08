import { taskSchema } from './task.schema'
import { Priority, TaskStatus } from '../../types'

describe('taskSchema', () => {
  const valid = {
    title: 'Write documentation',
    description: 'Cover the setup steps',
    status: TaskStatus.TODO,
    priority: Priority.MEDIUM,
    dueDate: '2026-01-01T10:00',
  }

  it('accepts a valid task', () => {
    expect(taskSchema.safeParse(valid).success).toBe(true)
  })

  it('allows description and dueDate to be omitted', () => {
    const result = taskSchema.safeParse({
      title: 'Write documentation',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty title', () => {
    const result = taskSchema.safeParse({ ...valid, title: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required')
    }
  })

  it('rejects an unknown status', () => {
    const result = taskSchema.safeParse({ ...valid, status: 'ARCHIVED' })
    expect(result.success).toBe(false)
  })
})
