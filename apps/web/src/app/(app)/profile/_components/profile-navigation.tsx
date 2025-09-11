import { Building2, User } from 'lucide-react'

import { Sidebar, SidebarLink } from '@/components/sidebar'

export function ProfileNavigation() {
  return (
    <Sidebar>
      <SidebarLink href={`/profile`}>
        <User className="size-4" />
        Profile
      </SidebarLink>
      <SidebarLink href={`/profile/organizations`}>
        <Building2 className="size-4" />
        Organizations
      </SidebarLink>
    </Sidebar>
  )
}
