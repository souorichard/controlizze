'use client'

import {
  BadgeDollarSign,
  LayoutDashboard,
  LogOut,
  Repeat,
  Settings,
  Tags,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { getInitials } from '@/utils/get-initials'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface AccountMenuClientProps {
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
  currentOrg: string | null
}

export function AccountMenuClient({
  user,
  currentOrg,
}: AccountMenuClientProps) {
  const iconStyle = 'size-4 text-muted-foreground'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none group" asChild>
        <Avatar className="size-8">
          <AvatarImage src={user.avatarUrl as string} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="p-2 flex items-center gap-3 outline-none">
          <Avatar className="size-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl as string} />}
            <AvatarFallback className="text-sm">
              {getInitials(user.name ?? 'Unknown user')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-medium truncate">
              {user.name ?? 'Unknown user'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="space-y-4">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={'/account'}>
                <User className={iconStyle} />
                Profile
              </Link>
            </DropdownMenuItem>

            {currentOrg && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href={`/orgs/${currentOrg}/overview`}>
                    <LayoutDashboard className={iconStyle} />
                    Overview
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/orgs/${currentOrg}/transactions`}>
                    <BadgeDollarSign className={iconStyle} />
                    Transactions
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/orgs/${currentOrg}/recurrences`}>
                    <Repeat className={iconStyle} />
                    Recurrences
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/orgs/${currentOrg}/categories`}>
                    <Tags className={iconStyle} />
                    Categories
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`/orgs/${currentOrg}/overview`}>
                    <Settings className={iconStyle} />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <a href="/api/auth/sign-out">
                <LogOut className={iconStyle} />
                Log out
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
