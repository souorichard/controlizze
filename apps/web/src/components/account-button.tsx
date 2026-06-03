import { Building2, HandCoins, LogOut, Menu, User } from 'lucide-react'
import Link from 'next/link'

import { auth, getCurrentOrg } from '@/utils/auth'
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

export async function AccountButton() {
  const { user } = await auth()

  const currentOrg = await getCurrentOrg()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Menu className="size-6 cursor-pointer" />
          <span className="sr-only">Abrir menu do usuário</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="mb-2 p-2 flex items-center gap-3 outline-none">
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

        {/* <DropdownMenuSeparator /> */}

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
          <Link href={`/orgs/${currentOrg}/settings/billing`}>
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
