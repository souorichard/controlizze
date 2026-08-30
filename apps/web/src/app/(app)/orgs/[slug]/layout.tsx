import type { PropsWithChildren } from 'react'
import {
  Container,
  ContainerHeader,
  ContainerMain,
} from '@/components/container'
import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'

export default async function OrganizationLayout({
  children,
}: PropsWithChildren) {
  return (
    <Container>
      {/* <AnimatedBackground /> */}

      <ContainerHeader className="space-y-4">
        <Header />
        <Tabs />
      </ContainerHeader>

      <ContainerMain>{children}</ContainerMain>
    </Container>
  )
}
