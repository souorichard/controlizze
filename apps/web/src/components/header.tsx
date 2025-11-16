import Image from 'next/image'
import Link from 'next/link'

import controlizzeIcon from '@/assets/brand/icon.svg'

import { OrganizationSwitcher } from './organization-switcher'
import { PendingInvites } from './pending-invites'
import { ProfileButton } from './profile-button'
import { Separator } from './ui/separator'

export async function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-5 md:gap-4">
      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/">
          <Image
            src={controlizzeIcon}
            alt="Controlizze"
            className="size-7 shrink-0"
          />
        </Link>

        <Separator orientation="vertical" className="!h-5" />

        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* {currentOrganization && (
          <Button size="sm" className="hidden md:inline-flex" asChild>
            <Link href={`/orgs/${currentOrganization}/create-transaction`}>
              <CirclePlus className="size-4" />
              New transaction
            </Link>
          </Button>
        )} */}

        <Separator orientation="vertical" className="!h-5 lg:hidden" />

        <div className="flex items-center gap-2">
          <PendingInvites />
          <ProfileButton />
        </div>
      </div>
    </header>
  )
}
