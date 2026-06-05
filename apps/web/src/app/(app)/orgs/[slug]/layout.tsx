import type { ReactNode } from 'react'
import { AnimatedBackground } from '@/components/animated-background'
import {
  Container,
  ContainerHeader,
  ContainerMain,
  ContainerMainWrapper,
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
      <AnimatedBackground />

      <ContainerHeader className="space-y-4">
        <Header />
        <Tabs />
      </ContainerHeader>

      <ContainerMain>
        <ContainerMainWrapper>{children}</ContainerMainWrapper>
      </ContainerMain>
    </Container>
  )
}
