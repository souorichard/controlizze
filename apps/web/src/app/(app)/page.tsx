import { ArrowRight, Building2 } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import {
  Container,
  HeaderContainer,
  MainContainer,
} from '@/components/container'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home() {
  return (
    <Container className="flex min-h-screen flex-col">
      <HeaderContainer className="pb-5">
        <Header />
      </HeaderContainer>
      <MainContainer className="flex flex-1 flex-col items-center justify-center gap-12 bg-[url(../assets/home-bg.png)] bg-cover bg-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-primary/10 mb-2 flex items-center justify-center rounded-full p-3 lg:p-4">
            <Building2 className="text-primary size-8 lg:size-10" />
          </div>
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Welcome to your workspace
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base text-pretty lg:text-xl">
            Select an existing organization to continue or create a new one to
            get started with your team.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/create-organization">
            Create organization
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </MainContainer>
    </Container>
  )
}
