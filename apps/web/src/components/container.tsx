import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface GenericProps {
  className?: string
  children: ReactNode
}

export function Container({ className, children }: GenericProps) {
  return <div className={cn('', className)}>{children}</div>
}

export function HeaderContainer({ className, children }: GenericProps) {
  return (
    <div className={cn('bg-muted/10 border-b pt-5', className)}>{children}</div>
  )
}

export function MainContainer({ className, children }: GenericProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-7xl space-y-5 px-5 py-8', className)}
    >
      {children}
    </div>
  )
}
