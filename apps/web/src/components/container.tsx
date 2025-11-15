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
    <div
      className={cn(
        'bg-card sticky top-0 right-0 left-0 z-50 border-b pt-5 shadow-xl shadow-black/50',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function MainContainer({ className, children }: GenericProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-7xl space-y-8 px-5 py-8', className)}
    >
      {children}
    </div>
  )
}
