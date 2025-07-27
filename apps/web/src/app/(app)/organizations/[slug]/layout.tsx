import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

import { isAuthenticated } from '@/auth/auth'
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
  if (!(await isAuthenticated())) {
    redirect('/auth/sign-in')
  }

  return (
    <Container>
      <HeaderContainer className="space-y-5 border-b">
        <Header />
        <Tabs />
      </HeaderContainer>
      <MainContainer>{children}</MainContainer>
    </Container>
  )
}
