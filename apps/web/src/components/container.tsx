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
    <header
      className={cn(
        'sticky top-0 z-40 px-5 pt-5 border-b bg-background/60 backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </header>
  )
}

export function ContainerMain({ className, children }: GenericProps) {
  return (
    <main className={cn('px-5 py-10 md:py-12', className)}>{children}</main>
  )
}

export function ContainerContent({ className, children }: GenericProps) {
  return (
    <div className={cn('max-w-7xl w-full mx-auto space-y-8', className)}>
      {children}
    </div>
  )
}

export function ContainerContentHeader({ className, children }: GenericProps) {
  return <div className={cn('space-y-1', className)}>{children}</div>
}

export function ContainerContentTitle({ className, children }: GenericProps) {
  return (
    <h1
      className={cn('text-4xl font-bold font-heading tracking-wide', className)}
    >
      {children}
    </h1>
  )
}

export function ContainerContentDescription({
  className,
  children,
}: GenericProps) {
  return <p className={cn('text-muted-foreground', className)}>{children}</p>
}

export function ContainerContentFilter({ className, children }: GenericProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>{children}</div>
  )
}

export function ContainerContentList({ className, children }: GenericProps) {
  return <section className={cn('space-y-3', className)}>{children}</section>
}

export function ContainerContentListWrapper({
  className,
  children,
}: GenericProps) {
  return (
    <div
      className={cn(
        'border-2 bg-card/40 backdrop-blur-xl ring-1 ring-foreground/10 rounded-xl overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
