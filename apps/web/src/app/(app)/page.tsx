import { Building2 } from 'lucide-react'
import type { Metadata } from 'next'
import {
  Container,
  ContainerContent,
  ContainerContentDescription,
  ContainerContentHeader,
  ContainerContentTitle,
  ContainerHeader,
  ContainerMain,
} from '@/components/container'
import { Header } from '@/components/header'
import { OrgSelector } from './_components/org-selector'

export const metadata: Metadata = {
  title: 'Home',
}

export default function HomePage() {
  return (
    <Container className="flex flex-col">
      <ContainerHeader className="pb-5">
        <Header isHome />
      </ContainerHeader>

      <ContainerMain className="flex flex-1 justify-center">
        <ContainerContent className="max-w-2xl">
          <ContainerContentHeader>
            <ContainerContentTitle>
              Choose an organization
            </ContainerContentTitle>
            <ContainerContentDescription>
              Select one to open its dashboard, or create a new organization
            </ContainerContentDescription>
          </ContainerContentHeader>

          <OrgSelector />

          <div className="hidden justify-center items-center gap-2 text-muted-foreground md:flex">
            <Building2 className="size-4" />
            <p className="text-xs">
              If you already have an organization, ask the owner to invite you
            </p>
          </div>
        </ContainerContent>
      </ContainerMain>
    </Container>
  )
}
