import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  className,
  id,
  ...props
}) => {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
          'focus:outline-none focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-50 disabled:text-gray-500',
          error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
          className
        )}
        {...props}
      />
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  )
}

export default Input