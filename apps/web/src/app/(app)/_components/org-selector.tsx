'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Building2 } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials } from '@/utils/get-initials'
import { getOrgsAction } from '../action'

export function OrgSelector() {
  const { data: orgs, isLoading } = useQuery({
    queryKey: ['orgs'],
    queryFn: () => getOrgsAction(),
  })

  if (isLoading) {
    return <OrgSelectorSkeleton />
  }

  if (!orgs?.length) {
    return (
      <div className="rounded-md border border-border px-4 py-8 flex flex-col items-center gap-2 text-center">
        <Building2 className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No organizations found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border overflow-hidden">
      {orgs?.map((org) => (
        <Link
          key={org.id}
          href={`/orgs/${org.slug}/overview`}
          className="group flex items-center gap-3 px-4 py-3.5 bg-muted/20 hover:bg-muted/40 transition-colors border-b border-border last:border-0"
        >
          <Avatar className="size-9">
            <AvatarImage src={org.avatarUrl ?? undefined} alt={org.name} />
            <AvatarFallback className="rounded-lg bg-primary/20 text-primary text-xs font-semibold">
              {getInitials(org.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{org.name}</p>
            <p className="text-xs text-muted-foreground">
              {org.role.charAt(0).toUpperCase() + org.role.slice(1)} · Free
            </p>
          </div>

          <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      ))}
    </div>
  )
}

export function OrgSelectorSkeleton() {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: This is a skeleton component, so using the index as a key is acceptable here.
          key={i}
          className="flex items-center gap-3 px-4 py-3.5 bg-muted/20 border-b border-border last:border-0"
        >
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
