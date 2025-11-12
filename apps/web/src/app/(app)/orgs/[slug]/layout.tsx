import { ReactNode } from 'react'

import {
  Container,
  HeaderContainer,
  MainContainer,
} from '@/components/container'
import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'

interface OrganizationLayoutProps {
  children: ReactNode
}

export default async function OrganizationLayout({
  children,
}: OrganizationLayoutProps) {
  return (
    <Container>
      <HeaderContainer className="space-y-4">
        <Header />
        <Tabs />
      </HeaderContainer>
      <MainContainer>{children}</MainContainer>
    </Container>
  )
}
