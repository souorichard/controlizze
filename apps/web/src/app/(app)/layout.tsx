import { ReactNode } from 'react'

import { getCurrentOrganization } from '@/auth/auth'
import { OrganizationProvider } from '@/contexts/organization-context'

interface AppLayoutProps {
  children: ReactNode
  dialog: ReactNode
}

export default async function AppLayout({ children, dialog }: AppLayoutProps) {
  const currentOrganization = await getCurrentOrganization()

  return (
    <OrganizationProvider organization={currentOrganization!}>
      {children}
      {dialog}
    </OrganizationProvider>
  )
}
