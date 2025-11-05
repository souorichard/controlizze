import { Check, ChevronsUpDown, CirclePlus } from 'lucide-react'
import Link from 'next/link'

import { getCurrentOrganization } from '@/auth/auth'
import { getOrganizations } from '@/http/organization/get-organizations'
import { getInitials } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export async function OrganizationSwitcher() {
  const currentOrganizationByCookie = await getCurrentOrganization()

  const { organizations } = await getOrganizations()

  const currentOrganization = organizations.find(
    (organization) => organization.slug === currentOrganizationByCookie,
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary bg-background flex h-9 w-[160px] items-center gap-2 rounded-md border px-3 text-sm font-medium outline-none focus-visible:ring-2 lg:w-56">
        {currentOrganization ? (
          <>
            <Avatar className="mr-1 size-5">
              {currentOrganization.avatarUrl && (
                <AvatarImage src={currentOrganization.avatarUrl as string} />
              )}
              <AvatarFallback className="text-xs">
                {getInitials(currentOrganization.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{currentOrganization.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground truncate">
            Select organization
          </span>
        )}
        <ChevronsUpDown className="text-muted-foreground ml-auto size-6 lg:size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={12} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>

          {organizations.map((organization) => {
            return (
              <DropdownMenuItem key={organization.id} asChild>
                <Link href={`/orgs/${organization.slug}/overview`}>
                  <Avatar className="size-6">
                    {organization.avatarUrl && (
                      <AvatarImage src={organization.avatarUrl as string} />
                    )}
                    <AvatarFallback className="text-xs">
                      {getInitials(organization.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{organization.name}</span>
                  {organization.slug === currentOrganization?.slug && (
                    <Check className="text-primary ml-auto size-4" />
                  )}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <CirclePlus className="text-primary size-6" />
            Create organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
