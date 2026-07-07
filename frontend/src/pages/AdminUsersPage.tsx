import { useEffect, useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { deleteUser, getUsers } from '../features/admin/admin.api'
import { useAuth } from '../features/auth/useAuth'
import { extractErrorMessage } from '../lib/api'
import type { UserSummary } from '../types'

export function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<UserSummary | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setUsers(await getUsers())
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load users'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const confirmDelete = async () => {
    if (!deleting) return
    setSubmitting(true)
    try {
      await deleteUser(deleting.id)
      setDeleting(null)
      await load()
    } catch (err) {
      setError(extractErrorMessage(err, 'Unable to delete user'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage accounts and access.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm text-slate-400">Loading users…</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Roles</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {row.username}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.roles.map((role) => (
                        <Badge
                          key={role}
                          className="bg-brand-50 text-brand-700"
                        >
                          {role.replace('ROLE_', '')}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.username !== user?.username && (
                      <Button
                        variant="ghost"
                        onClick={() => setDeleting(row)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete user"
        message={`Delete ${deleting?.username}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={submitting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
