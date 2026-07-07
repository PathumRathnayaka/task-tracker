import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { TasksPage } from './pages/TasksPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/tasks" element={<TasksPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  )
}

export default App
