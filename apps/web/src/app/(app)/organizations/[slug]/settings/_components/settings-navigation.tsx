import { Settings2, Users } from 'lucide-react'

import { ability, getCurrentOrganization } from '@/auth/auth'

import { SettingsNavLink } from './settings-nav-link'

export async function SettingsNavigation() {
  const currentOrganization = await getCurrentOrganization()
  const permissions = await ability()

  const canGetMembers = permissions?.can('get', 'User')
  // const canGetBilling = permissions?.can('get', 'Billing')

  return (
    <nav className="bg-secondary/25 flex gap-1 rounded-md p-1 lg:w-[16rem] lg:flex-col lg:bg-transparent lg:p-0">
      <SettingsNavLink href={`/organizations/${currentOrganization}/settings`}>
        <Settings2 className="size-4" />
        General
      </SettingsNavLink>

      {canGetMembers && (
        <SettingsNavLink
          href={`/organizations/${currentOrganization}/settings/members`}
        >
          <Users className="size-4" />
          Members
        </SettingsNavLink>
      )}

      {/* {canGetBilling && (
        <SettingsNavLink
          href={`/organizations/${currentOrganization}/settings/billing`}
        >
          <HandCoins className="size-4" />
          Billing
        </SettingsNavLink>
      )} */}
    </nav>
  )
}
