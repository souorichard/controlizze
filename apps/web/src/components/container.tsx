'use client'

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface GenericProps {
  className?: string
  children?: ReactNode
}

export function Container({ className, children }: GenericProps) {
  return (
    <div className={cn('relative min-h-screen', className)}>{children}</div>
  )
}

export function ContainerHeader({ className, children }: GenericProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-40 px-5 pt-5 border-b bg-background/60 backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ContainerMain({ className, children }: GenericProps) {
  return <div className={cn('px-5 py-8', className)}>{children}</div>
}

export function ContainerMainWrapper({ className, children }: GenericProps) {
  return (
    <div className={cn('max-w-7xl w-full mx-auto space-y-8', className)}>
      {children}
    </div>
  )
}
