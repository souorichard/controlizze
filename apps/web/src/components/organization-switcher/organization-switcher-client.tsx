'use client'

import type { Role } from '@controlizze/rbac'
import { Check, ChevronsUpDown, CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { getInitials } from '@/utils/get-initials'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface OrganizationSwitcherClientProps {
  currentOrg:
    | {
        id: string
        name: string
        slug: string
        avatarUrl: string | null
        role: Role
      }
    | undefined
  orgs: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
    role: Role
  }[]
}

export function OrganizationSwitcherClient({
  currentOrg,
  orgs,
}: OrganizationSwitcherClientProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary bg-background flex h-9 w-40 items-center gap-2 rounded-md border px-3 text-sm font-medium outline-none focus-visible:ring-2 sm:w-56 cursor-pointer">
        {currentOrg ? (
          <>
            <Avatar className="mr-1 size-5">
              {currentOrg.avatarUrl && (
                <AvatarImage src={currentOrg.avatarUrl as string} />
              )}
              <AvatarFallback className="text-xs">
                {getInitials(currentOrg.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{currentOrg.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground truncate">
            Select an organization
          </span>
        )}
        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={12} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>ORGANIZATIONS</DropdownMenuLabel>

          {orgs.map((org) => {
            return (
              <DropdownMenuItem key={org.id} asChild>
                <Link href={`/orgs/${org.slug}/overview`}>
                  <Avatar className="size-5">
                    {org.avatarUrl && (
                      <AvatarImage src={org.avatarUrl as string} />
                    )}
                    <AvatarFallback className="text-xs">
                      {getInitials(org.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{org.name}</span>
                  {org.slug === currentOrg?.slug && (
                    <Check className="text-primary ml-auto size-4" />
                  )}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/create-org">
            <CirclePlus className="text-primary size-5" />
            Create organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
