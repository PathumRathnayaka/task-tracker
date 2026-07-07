import { useAuth } from '../features/auth/useAuth'

export function TasksPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Your tasks</h1>
      <p className="mt-2 text-sm text-slate-500">
        Signed in as {user?.username}.
      </p>
    </div>
  )
}
