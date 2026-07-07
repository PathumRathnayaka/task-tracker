import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Input } from '../components/ui/Input'
import {
  registerSchema,
  type RegisterValues,
} from '../features/auth/auth.schema'
import { useAuth } from '../features/auth/useAuth'
import { extractErrorMessage } from '../lib/api'

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterValues) => {
    setFormError(null)
    try {
      await registerUser(values)
      navigate('/tasks')
    } catch (error) {
      setFormError(extractErrorMessage(error, 'Unable to create account'))
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking your tasks in minutes"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600">
            Sign in
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
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            invalid={!!errors.email}
            {...register('email')}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...register('password')}
          />
        </Field>
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
