import Image from 'next/image'

import controlizzeIcon from '@/assets/controlizze/icon.svg'

import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5">
      <div className="flex items-center gap-3">
        <Image src={controlizzeIcon} alt="Controlizze" className="size-9" />
      </div>

      <div className="flex items-center gap-3">
        <ProfileButton />
      </div>
    </header>
  )
}
