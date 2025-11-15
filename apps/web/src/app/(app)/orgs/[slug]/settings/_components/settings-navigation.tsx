import { HandCoins, Settings2, Users } from 'lucide-react'

import { ability, getCurrentOrganization } from '@/auth/auth'
import { Sidebar, SidebarLink } from '@/components/sidebar'

export async function SettingsNavigation() {
  const currentOrganization = await getCurrentOrganization()
  const permissions = await ability()

  const canGetMembers = permissions?.can('get', 'User')
  const canGetBilling = permissions?.can('get', 'Billing')

  return (
    <Sidebar>
      <SidebarLink href={`/orgs/${currentOrganization}/settings`}>
        <Settings2 className="size-4" />
        General
      </SidebarLink>

      {canGetMembers && (
        <SidebarLink href={`/orgs/${currentOrganization}/settings/members`}>
          <Users className="size-4" />
          Members
        </SidebarLink>
      )}

      {canGetBilling && (
        <SidebarLink href={`/orgs/${currentOrganization}/settings/billing`}>
          <HandCoins className="size-4" />
          Billing
        </SidebarLink>
      )}
    </Sidebar>
  )
}
