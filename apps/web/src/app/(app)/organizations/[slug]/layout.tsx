import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

import { isAuthenticated } from '@/auth/auth'
import {
  Container,
  HeaderContainer,
  MainContainer,
} from '@/components/container'
import { Header } from '@/components/header'

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
      <HeaderContainer className="border-b pb-5">
        <Header />
      </HeaderContainer>
      <MainContainer>{children}</MainContainer>
    </Container>
  )
}
