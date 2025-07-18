import { ChevronDown, LogOut } from 'lucide-react'

import { auth } from '@/auth/auth'
import { getInitials } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export async function ProfileButton() {
  const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">
            {user.name ?? 'Undefined'}
          </span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
        <Avatar className="size-9">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl as string} />}
          <AvatarFallback className="text-sm">
            {getInitials(user.name ?? 'Undefined')}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="size-4" />
            Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
