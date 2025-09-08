'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

interface SettingsNavLinkProps extends ComponentProps<typeof Link> {}

export function SettingsNavLink(props: SettingsNavLinkProps) {
  const pathname = usePathname()

  const isCurrent = pathname === props.href.toString()

  return (
    <Link
      data-current={isCurrent}
      className="text-muted-foreground data-[current=true]:bg-secondary/40 data-[current=true]:text-foreground data-[current=false]:hover:text-foreground flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition lg:justify-start"
      {...props}
    >
      {props.children}
    </Link>
  )
}
