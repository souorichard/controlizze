import { Slash } from 'lucide-react'
import Image from 'next/image'

import controlizzeIcon from '@/assets/controlizze/icon.svg'

import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5">
      <div className="flex items-center gap-4">
        <Image src={controlizzeIcon} alt="Controlizze" className="size-9" />

        <Slash className="text-border size-4 -rotate-[24deg]" />

        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </header>
  )
}
