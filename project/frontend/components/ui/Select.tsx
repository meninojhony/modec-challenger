import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  options: SelectOption[]
  placeholder?: string
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helper,
  options,
  placeholder,
  className,
  id,
  ...props
}) => {
  const generatedId = useId()
  const selectId = id || generatedId

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
          'focus:outline-none focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-gray-50 disabled:text-gray-500',
          error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  )
}

export default Select