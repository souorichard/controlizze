import Image from 'next/image'
import Link from 'next/link'
import controlizzeIcon from '@/assets/brand/controlizze-icon.svg'
import { AccountMenu } from './account-menu'
import { OrganizationSwitcher } from './organization-switcher'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <div className="max-w-7xl w-full mx-auto flex justify-between items-center gap-3 md:gap-4">
      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/">
          <Image
            src={controlizzeIcon}
            alt="Controlizze"
            className="size-7 shrink-0"
          />
        </Link>

        <Separator orientation="vertical" className="h-5" />

        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Separator orientation="vertical" className="h-5! lg:hidden" />

        <div className="flex items-center gap-2">
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
