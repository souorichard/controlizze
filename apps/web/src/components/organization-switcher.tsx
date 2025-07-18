import { ChevronsUpDown, CirclePlus } from 'lucide-react'
import Link from 'next/link'

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
  const { organizations } = await getOrganizations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary flex h-9 w-[180px] items-center gap-2 rounded px-1 text-sm font-medium outline-none focus-visible:ring-2">
        <span className="text-muted-foreground">Select organization</span>
        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        alignOffset={-8}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organization(s)</DropdownMenuLabel>

          {organizations.map((organization) => {
            return (
              <DropdownMenuItem key={organization.id} asChild>
                <Link href={`/organizations/${organization.slug}`}>
                  <Avatar className="size-5">
                    {organization.avatarUrl && (
                      <AvatarImage src={organization.avatarUrl as string} />
                    )}
                    <AvatarFallback>
                      {getInitials(organization.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{organization.name}</span>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <CirclePlus className="size-5" />
          Create organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
