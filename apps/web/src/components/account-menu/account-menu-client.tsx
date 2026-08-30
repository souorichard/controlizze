'use client'

import {
  BadgeDollarSign,
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  Repeat,
  Settings,
  Tags,
  User,
  X,
} from 'lucide-react'
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
      <DropdownMenuTrigger className="outline-none group">
        <Menu className="size-6 cursor-pointer transition-all duration-200 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0 group-data-[state=open]:scale-75 absolute" />
        <X className="size-6 cursor-pointer transition-all duration-200 group-data-[state=closed]:rotate-90 group-data-[state=closed]:opacity-0 group-data-[state=closed]:scale-75" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="p-2 flex items-center gap-3 outline-none">
          <Avatar className="size-8">
            {user.avatarUrl && (
              <AvatarImage
                src={user.avatarUrl as string}
                className="rounded-md"
              />
            )}
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
          {currentOrg && (
            <DropdownMenuGroup>
              {/* <DropdownMenuLabel>MENU</DropdownMenuLabel> */}

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
            </DropdownMenuGroup>
          )}

          <DropdownMenuGroup>
            {currentOrg && <DropdownMenuLabel>ACCOUNT</DropdownMenuLabel>}

            <DropdownMenuItem asChild>
              <Link href={'/account'}>
                <User className={iconStyle} />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={'/account/orgs'}>
                <Building2 className={iconStyle} />
                Organizations
              </Link>
            </DropdownMenuItem>

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
