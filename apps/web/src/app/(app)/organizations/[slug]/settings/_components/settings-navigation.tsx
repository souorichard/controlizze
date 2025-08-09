import { HandCoins, Settings2, Users } from 'lucide-react'

import { ability, getCurrentOrganization } from '@/auth/auth'

import { SettingsNavLink } from './settings-nav-link'

export async function SettingsNavigation() {
  const currentOrganization = await getCurrentOrganization()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetMembers = permissions?.can('get', 'User')
  const canGetBilling = permissions?.can('get', 'Billing')

  return (
    <nav className="flex flex-col gap-1">
      {canUpdateOrganization && (
        <SettingsNavLink
          href={`/organizations/${currentOrganization}/settings`}
        >
          <Settings2 className="size-4" />
          General
        </SettingsNavLink>
      )}

      {canGetMembers && (
        <SettingsNavLink
          href={`/organizations/${currentOrganization}/settings/members`}
        >
          <Users className="size-4" />
          Members
        </SettingsNavLink>
      )}

      {canGetBilling && (
        <SettingsNavLink
          href={`/organizations/${currentOrganization}/settings/billing`}
        >
          <HandCoins className="size-4" />
          Billing
        </SettingsNavLink>
      )}
    </nav>
  )
}
