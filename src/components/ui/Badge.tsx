import React, { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantClasses = {
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    info: 'badge-info',
    default: 'bg-gray-100 text-gray-800',
  }

  return (
    <span className={cn('badge', variantClasses[variant], className)}>
      {children}
    </span>
  )
}