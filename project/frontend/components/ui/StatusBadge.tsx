import React from 'react'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'draft' | 'active' | 'suspended' | 'terminated' | 'expired'
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const styles = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-success-100 text-success-800',
    suspended: 'bg-warning-100 text-warning-800',
    terminated: 'bg-error-100 text-error-800',
    expired: 'bg-gray-100 text-gray-600',
  }

  const labels = {
    draft: 'Draft',
    active: 'Active',
    suspended: 'Suspended',
    terminated: 'Terminated',
    expired: 'Expired',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  )
}

export default StatusBadge