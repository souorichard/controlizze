'use client'

import { Building2, HandCoins, LogOut, Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { getInitials } from '@/utils/get-initials'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface AccountButtonProps {
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
  org: string | null
}

export function AccountButton({ user, org }: AccountButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none group">
        <Menu className="size-6 cursor-pointer transition-all duration-200 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0 group-data-[state=open]:scale-75 absolute" />
        <X className="size-6 cursor-pointer transition-all duration-200 group-data-[state=closed]:rotate-90 group-data-[state=closed]:opacity-0 group-data-[state=closed]:scale-75" />
        <span className="sr-only">Abrir menu do usuário</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="p-2 flex items-center gap-3 outline-none">
          <Avatar className="size-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl as string} />}
            <AvatarFallback className="text-sm">
              {getInitials(user.name ?? 'Indefinido')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-medium truncate">
              {user.name ?? 'Indefinido'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={'/account'}>
            <User className="text-muted-foreground size-5" />
            Conta
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={'/account/orgs'}>
            <Building2 className="text-muted-foreground size-5" />
            Organizações
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/orgs/${org}/settings/billing`}>
            <HandCoins className="text-muted-foreground size-5" />
            Assinatura
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="text-destructive size-5" />
            Sair
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
