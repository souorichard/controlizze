import { Check, ChevronsUpDown, CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { getOrgs } from '@/http/orgs/get-orgs'
import { getCurrentOrg } from '@/utils/auth'
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
  const currentOrgByCookie = await getCurrentOrg()

  const { orgs } = await getOrgs()

  const currentOrg = orgs.find((org) => org.slug === currentOrgByCookie)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:ring-primary bg-background flex h-9 w-40 items-center gap-2 rounded-md border px-3 text-sm font-medium outline-none focus-visible:ring-2 sm:w-56">
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
            Selecione uma organização
          </span>
        )}
        <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={12} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>ORGANIZAÇÕES</DropdownMenuLabel>

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
          <Link href="/create-organization">
            <CirclePlus className="text-primary size-5" />
            Nova organização
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
