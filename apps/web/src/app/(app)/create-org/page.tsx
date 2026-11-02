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
import { OrgForm } from '@/components/forms/org-form'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Create organization',
}

export default function CreateOrgPage() {
  return (
    <Container className="flex flex-col">
      <ContainerHeader className="pb-5">
        <Header isHome />
      </ContainerHeader>

      <ContainerMain className="flex flex-1 justify-center">
        <ContainerContent className="max-w-2xl">
          <ContainerContentHeader>
            <ContainerContentTitle>Create organization</ContainerContentTitle>
            <ContainerContentDescription>
              Let's get your organization set up. It only takes a minute
            </ContainerContentDescription>
          </ContainerContentHeader>

          <OrgForm />
        </ContainerContent>
      </ContainerMain>
    </Container>
  )
}
