import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'
import { Priority, TaskStatus } from '../../types'

describe('TaskForm', () => {
  it('shows a validation error when the title is empty', async () => {
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={() => {}} />)

    await userEvent.click(screen.getByRole('button', { name: 'Create task' }))

    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a normalised payload', async () => {
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} onCancel={() => {}} />)

    await userEvent.type(screen.getByLabelText('Title'), 'Ship the release')
    await userEvent.click(screen.getByRole('button', { name: 'Create task' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Ship the release',
      description: null,
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: null,
    })
  })

  it('pre-fills fields when editing an existing task', () => {
    const onSubmit = vi.fn()
    render(
      <TaskForm
        task={{
          id: 1,
          title: 'Existing task',
          description: 'Details',
          status: TaskStatus.IN_PROGRESS,
          priority: Priority.HIGH,
          dueDate: null,
          createdAt: '2026-01-01T00:00:00',
          updatedAt: '2026-01-01T00:00:00',
          userId: 1,
        }}
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    )

    expect(screen.getByLabelText('Title')).toHaveValue('Existing task')
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
  })
})
