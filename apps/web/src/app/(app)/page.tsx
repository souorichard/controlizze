import { Building2, CirclePlus } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Container,
  ContainerHeader,
  ContainerMain,
} from '@/components/container'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
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
        <div className="max-w-2xl w-full space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-wide">
              Organize your finances
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl text-pretty md:text-base">
              Each organization has its own transactions, charts, and insights.
              Let's start?
            </p>
          </div>

          <div className="space-y-4">
            <OrgSelector />

            <Button variant="outline" className="w-full" asChild>
              <Link href="/create-org">
                <CirclePlus className="size-4" />
                Create organization
              </Link>
            </Button>
          </div>

          <div className="hidden justify-center items-center gap-2 text-muted-foreground md:flex">
            <Building2 className="size-4" />
            <p className="text-xs">
              If you already have an organization, ask the owner to invite you
            </p>
          </div>
        </div>
      </ContainerMain>
    </Container>
  )
}
