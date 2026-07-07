import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import { loginSchema, type LoginValues } from '../features/auth/auth.schema'
import { useAuth } from '../features/auth/useAuth'
import { extractErrorMessage } from '../lib/api'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginValues) => {
    setFormError(null)
    try {
      await login(values)
      navigate('/tasks')
    } catch (error) {
      setFormError(extractErrorMessage(error, 'Unable to sign in'))
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your tasks"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {formError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}
        <Field label="Username" htmlFor="username" error={errors.username?.message}>
          <Input
            id="username"
            autoComplete="username"
            invalid={!!errors.username}
            {...register('username')}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            invalid={!!errors.password}
            {...register('password')}
          />
        </Field>
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}
