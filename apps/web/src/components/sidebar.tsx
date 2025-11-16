'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps, PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

export function Sidebar({ children }: PropsWithChildren) {
  return (
    <nav className="bg-secondary/25 grid grid-cols-2 gap-1 rounded-md p-1 md:flex md:grid-cols-none lg:w-[16rem] lg:flex-col lg:bg-transparent lg:p-0">
      {children}
    </nav>
  )
}

interface SidebarLinkProps extends ComponentProps<typeof Link> {
  className?: string
}

export function SidebarLink({ className, ...props }: SidebarLinkProps) {
  const pathname = usePathname()

  const isCurrent = pathname === props.href.toString()

  return (
    <Link
      data-current={isCurrent}
      className={cn(
        'text-muted-foreground data-[current=true]:bg-secondary/40 data-[current=true]:text-foreground data-[current=false]:hover:text-foreground flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition lg:justify-start',
        className,
      )}
      {...props}
    >
      {props.children}
    </Link>
  )
}
