import { Slash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import controlizzeIcon from '@/assets/brand/controlizze-icon.svg'
import controlizzeLogo from '@/assets/brand/controlizze-logo.svg'
import { AccountMenu } from './account-menu'
import { OrganizationSwitcher } from './organization-switcher'

interface HeaderProps {
  isHome?: boolean
}

export function Header({ isHome = false }: HeaderProps) {
  return (
    <div className="max-w-7xl w-full mx-auto flex justify-between items-center gap-3 md:gap-4">
      <div className="flex items-center gap-2 md:gap-3">
        <Link href="/">
          {!isHome ? (
            <Image
              src={controlizzeIcon}
              alt="Controlizze"
              className="size-7 shrink-0"
            />
          ) : (
            <Image
              src={controlizzeLogo}
              alt="Controlizze"
              className="w-42 shrink-0"
            />
          )}
        </Link>

        {!isHome && (
          <>
            <Slash className="size-4 text-border rotate-[-24deg]" />
            <OrganizationSwitcher />
          </>
        )}
      </div>

      <AccountMenu />
    </div>
  )
}
