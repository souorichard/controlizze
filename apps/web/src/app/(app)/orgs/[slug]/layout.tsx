import { ReactNode } from 'react'

import { getCurrentOrganization } from '@/auth/auth'
import {
  Container,
  HeaderContainer,
  MainContainer,
} from '@/components/container'
import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'
import { OrganizationProvider } from '@/contexts/organization-context'

interface OrganizationLayoutProps {
  children: ReactNode
}

export default async function OrganizationLayout({
  children,
}: OrganizationLayoutProps) {
  const currentOrganization = await getCurrentOrganization()

  return (
    <OrganizationProvider organization={currentOrganization}>
      <Container>
        <HeaderContainer className="space-y-4">
          <Header />
          <Tabs />
        </HeaderContainer>
        <MainContainer>{children}</MainContainer>
      </Container>
    </OrganizationProvider>
  )
}
