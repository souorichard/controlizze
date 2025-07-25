import { ChevronsUpDown, CirclePlus } from 'lucide-react'
import Link from 'next/link'

import { getCurrentOrganization } from '@/auth/auth'
import { getOrganizations } from '@/http/organization/get-organizations'
import { getInitials } from '@/utils/get-initials'

import { CreateOrganizationDialog } from './create-organization-dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogTrigger } from './ui/dialog'
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
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-primary flex h-9 w-[180px] items-center gap-2 rounded px-1 text-sm font-medium outline-none focus-visible:ring-2">
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
            <span className="text-muted-foreground">Select organization</span>
          )}
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
                      <AvatarFallback className="text-xs">
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

          <DialogTrigger asChild>
            <DropdownMenuItem>
              <CirclePlus className="size-5" />
              Create organization
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateOrganizationDialog />
    </Dialog>
  )
}
