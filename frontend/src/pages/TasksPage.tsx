import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Modal } from '../components/ui/Modal'
import { Pagination } from '../components/tasks/Pagination'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskFilters } from '../components/tasks/TaskFilters'
import { TaskForm } from '../components/tasks/TaskForm'
import { getUsers } from '../features/admin/admin.api'
import { useAuth } from '../features/auth/useAuth'
import { createTask, deleteTask, updateTask } from '../features/tasks/tasks.api'
import { useTasks } from '../features/tasks/useTasks'
import { useTaskSocket } from '../features/tasks/useTaskSocket'
import { extractErrorMessage } from '../lib/api'
import type { Task, TaskPayload, UserSummary } from '../types'

export function TasksPage() {
  const { isAdmin } = useAuth()
  const {
    tasks,
    page,
    totalPages,
    totalElements,
    status,
    ownerId,
    loading,
    error,
    setPage,
    changeStatus,
    changeOwner,
    reload,
  } = useTasks()

  const { connected } = useTaskSocket(reload)

  const [owners, setOwners] = useState<UserSummary[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin) return
    getUsers()
      .then(setOwners)
      .catch(() => setOwners([]))
  }, [isAdmin])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditing(task)
    setFormOpen(true)
  }

  const submit = async (payload: TaskPayload) => {
    setSubmitting(true)
    setActionError(null)
    try {
      if (editing) {
        await updateTask(editing.id, payload)
      } else {
        await createTask(payload)
      }
      setFormOpen(false)
      setEditing(null)
      await reload()
    } catch (err) {
      setActionError(extractErrorMessage(err, 'Unable to save task'))
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setSubmitting(true)
    try {
      await deleteTask(deleting.id)
      setDeleting(null)
      await reload()
    } catch (err) {
      setActionError(extractErrorMessage(err, 'Unable to delete task'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">
              {isAdmin ? 'All tasks' : 'Your tasks'}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 text-xs ${
                connected ? 'text-green-600' : 'text-slate-400'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  connected ? 'bg-green-500' : 'bg-slate-300'
                }`}
              />
              {connected ? 'Live' : 'Offline'}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {totalElements} {totalElements === 1 ? 'task' : 'tasks'} total
          </p>
        </div>
        <Button onClick={openCreate}>New task</Button>
      </div>

      <div className="flex items-center justify-between">
        <TaskFilters
          status={status}
          onStatusChange={changeStatus}
          owners={isAdmin ? owners : undefined}
          ownerId={ownerId}
          onOwnerChange={isAdmin ? changeOwner : undefined}
        />
      </div>

      {actionError && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm text-slate-400">
          Loading tasks…
        </p>
      ) : error ? (
        <p className="py-12 text-center text-sm text-red-600">{error}</p>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-sm text-slate-500">No tasks yet.</p>
          <Button className="mt-4" onClick={openCreate}>
            Create your first task
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <Modal
        open={formOpen}
        title={editing ? 'Edit task' : 'New task'}
        onClose={() => setFormOpen(false)}
      >
        <TaskForm
          task={editing}
          submitting={submitting}
          onSubmit={submit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete task"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={submitting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
