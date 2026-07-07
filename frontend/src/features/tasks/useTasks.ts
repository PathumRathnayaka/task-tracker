import { useCallback, useEffect, useState } from 'react'
import { extractErrorMessage } from '../../lib/api'
import type { Task, TaskStatus } from '../../types'
import { getTasks } from './tasks.api'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [ownerId, setOwnerId] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getTasks({
        status: status || undefined,
        ownerId: ownerId || undefined,
        page,
      })
      setTasks(result.content)
      setTotalPages(result.totalPages)
      setTotalElements(result.totalElements)
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load tasks'))
    } finally {
      setLoading(false)
    }
  }, [status, ownerId, page])

  useEffect(() => {
    load()
  }, [load])

  const changeStatus = (value: TaskStatus | '') => {
    setStatus(value)
    setPage(0)
  }

  const changeOwner = (value: number | '') => {
    setOwnerId(value)
    setPage(0)
  }

  return {
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
    reload: load,
  }
}
