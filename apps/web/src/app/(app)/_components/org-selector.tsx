'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Building2, Plus } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/utils/get-initials'
import { getOrgsAction } from '../action'
import { OrgSelectorSkeleton } from './org-skeleton'

export function OrgSelector() {
  const { data: orgs, isLoading } = useQuery({
    queryKey: ['orgs'],
    queryFn: () => getOrgsAction(),
  })

  const thereAreOrgs = orgs?.length

  if (isLoading) {
    return <OrgSelectorSkeleton />
  }

  if (!thereAreOrgs) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-5 bg-card/60 rounded-xl border">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 flex items-center justify-center bg-primary/15 rounded-md">
            <Building2 className="size-5 text-primary" />
          </div>

          <p className="text-sm font-medium">No organizations yet</p>
          <p className="max-w-sm text-sm text-muted-foreground text-center">
            An organization holds your accounts, categories and transactions.
            Create your first one — you can invite teammates later
          </p>
        </div>

        <Button asChild>
          <Link href="/create-org">
            <Plus className="size-4" />
            Create organization
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border overflow-hidden">
        {orgs?.map((org) => (
          <Link
            key={org.id}
            href={`/orgs/${org.slug}/overview`}
            className="group h-15 flex items-center gap-3 px-5 bg-card/60 hover:bg-muted/40 transition-colors border-b last:border-0"
          >
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={org.avatarUrl ?? undefined} alt={org.name} />
              <AvatarFallback className="bg-primary/40 border-2 border-primary text-primary text-xs font-semibold">
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

      <Button variant="outline" className="w-full" asChild>
        <Link href="/create-org">
          <Plus className="size-4" />
          Create organization
        </Link>
      </Button>
    </div>
  )
}
