import { CirclePlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import controlizzeIcon from '@/assets/controlizze/icon.svg'
import { getCurrentOrganization } from '@/auth/auth'

import { OrganizationSwitcher } from './organization-switcher'
import { PendingInvites } from './pending-invites'
import { ProfileButton } from './profile-button'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

export async function Header() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image src={controlizzeIcon} alt="Controlizze" className="size-7" />
        </Link>

        <Separator orientation="vertical" className="!h-5" />

        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-4">
        {currentOrganization && (
          <Button size="sm" className="hidden md:inline-flex" asChild>
            <Link
              href={`/organizations/${currentOrganization}/create-transaction`}
            >
              <CirclePlus className="size-4" />
              New transaction
            </Link>
          </Button>
        )}

        <Separator orientation="vertical" className="!h-5" />

        <div className="flex items-center gap-2">
          <PendingInvites />
          <ProfileButton />
        </div>
      </div>
    </header>
  )
}
