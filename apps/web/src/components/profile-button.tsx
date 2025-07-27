import { CirclePlus, LogOut, Menu, User } from 'lucide-react'
import Link from 'next/link'

import { auth, getCurrentOrganization } from '@/auth/auth'
import { getInitials } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
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
      <DropdownMenuTrigger>
        <Menu className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="flex items-center gap-3 p-2 outline-none">
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

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/profile`}>
            <User className="text-muted-foreground size-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        {currentOrganization && (
          <DropdownMenuItem className="md:hidden" asChild>
            <Link href={`/organizations/${currentOrganization}/profile`}>
              <CirclePlus className="text-primary size-4" />
              Create transaction
            </Link>
          </DropdownMenuItem>
        )}

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
