import type { Metadata } from 'next'
import { AnimatedBackground } from '@/components/animated-background'
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
      <AnimatedBackground />

      <ContainerHeader className="pb-5">
        <Header />
      </ContainerHeader>

      <ContainerMain>
        <ContainerContent className="max-w-4xl">
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
