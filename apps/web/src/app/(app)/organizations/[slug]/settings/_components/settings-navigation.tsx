import { Settings2, Users } from 'lucide-react'

import { getCurrentOrganization } from '@/auth/auth'

import { SettingsNavLink } from './settings-nav-link'

export async function SettingsNavigation() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <nav className="flex flex-col gap-1">
      <SettingsNavLink href={`/organizations/${currentOrganization}/settings`}>
        <Settings2 className="size-4" />
        General
      </SettingsNavLink>

      <SettingsNavLink
        href={`/organizations/${currentOrganization}/settings/members`}
      >
        <Users className="size-4" />
        Members
      </SettingsNavLink>

      {/* <SettingsNavLink
            href={`/organizations/${currentOrganization}/settings`}
          >
            <HandCoins className="size-4" />
            Billing
          </SettingsNavLink> */}
    </nav>
  )
}
