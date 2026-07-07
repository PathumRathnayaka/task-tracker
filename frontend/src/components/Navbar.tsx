import { NavLink } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { Button } from './ui/Button'

export function Navbar() {
  const { user, isAdmin, logout } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-50 text-brand-700'
        : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-slate-900">
            Task Tracker
          </span>
          <nav className="flex items-center gap-1">
            <NavLink to="/tasks" className={linkClass}>
              Tasks
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin/users" className={linkClass}>
                Users
              </NavLink>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-500 sm:inline">
            {user?.email}
          </span>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
