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
      <SidebarLink
        href={`/orgs/${currentOrganization}/settings`}
        className="col-span-1 sm:col-span-0"
      >
        <Settings2 className="size-4" />
        General
      </SidebarLink>

      {canGetMembers && (
        <SidebarLink
          href={`/orgs/${currentOrganization}/settings/members`}
          className="col-span-1 sm:col-span-0"
        >
          <Users className="size-4" />
          Members
        </SidebarLink>
      )}

      {canGetBilling && (
        <SidebarLink
          href={`/orgs/${currentOrganization}/settings/billing`}
          className="col-span-2 sm:col-span-0"
        >
          <HandCoins className="size-4" />
          Billing
        </SidebarLink>
      )}
    </Sidebar>
  )
}
