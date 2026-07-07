import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = '', children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
})
