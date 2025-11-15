import { Building2, HandCoins, LogOut, Menu, User } from 'lucide-react'
import Link from 'next/link'

import { auth, getCurrentOrganization } from '@/auth/auth'
import { getInitials } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export async function ProfileButton() {
  const { user } = await auth()

  const currentOrganization = await getCurrentOrganization()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Menu className="size-6 cursor-pointer" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="mb-2 flex items-center gap-3 p-2 outline-none">
          <Avatar className="size-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl as string} />}
            <AvatarFallback className="text-sm">
              {getInitials(user.name ?? 'Undefined')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-medium">
              {user.name ?? 'Undefined'}
            </span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </div>

        {/* <DropdownMenuSeparator /> */}

        <DropdownMenuItem asChild>
          <Link href={`/profile`}>
            <User className="text-muted-foreground size-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/profile/orgs`}>
            <Building2 className="text-muted-foreground size-4" />
            Organizations
          </Link>
        </DropdownMenuItem>

        {/* {currentOrganization && (
          <DropdownMenuItem className="md:hidden" asChild>
            <Link
              href={`/orgs/${currentOrganization}/transactions/new`}
            >
              <CirclePlus className="text-primary size-4" />
              Create transaction
            </Link>
          </DropdownMenuItem>
        )} */}

        <DropdownMenuItem asChild>
          <Link href={`/orgs/${currentOrganization}/settings/billing`}>
            <HandCoins className="text-muted-foreground size-4" />
            Billing
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="text-destructive size-4" />
            Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
