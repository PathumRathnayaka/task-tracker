import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
        invalid
          ? 'border-red-400 focus:ring-red-200'
          : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'
      } ${className}`}
      {...props}
    />
  )
})
