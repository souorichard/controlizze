import { Astroid, Building2, CirclePlus } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/animated-background'
import {
  Container,
  ContainerHeader,
  ContainerMain,
} from '@/components/container'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Início',
}

export default function HomePage() {
  return (
    <Container className="flex flex-col">
      <AnimatedBackground />

      <ContainerHeader className="pb-5">
        <Header />
      </ContainerHeader>

      <ContainerMain className="flex flex-1 flex-col items-center justify-center gap-8">
        <div className="space-y-6 text-center">
          <div className="flex justify-center items-center">
            <span className="px-2.5 py-1 flex items-center gap-2 bg-primary/10 border border-primary rounded-full text-xs text-primary">
              <Astroid className="size-3 text-primary animate-pulse" />
              Sua área de trabalho
            </span>
          </div>

          <h1 className="text-2xl font-semibold font-heading tracking-wide lg:text-5xl">
            Bem-vindo ao{' '}
            <span className="bg-linear-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent animate-shimmer">
              Controlizze
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base text-pretty lg:text-lg">
            Cada organização tem suas próprias transações, gráficos e insights.
            Escolha uma existente ou crie sua primeira para começar
          </p>
        </div>

        <Button size="lg" asChild>
          <Link href="/create-organization">
            <CirclePlus className="size-5" />
            Nova organização
          </Link>
        </Button>

        <div className="flex justify-center items-center gap-2 text-muted-foreground">
          <Building2 className="size-4" />
          <p className="text-sm">
            Se você ainda não tem nenhuma organização. Crie a primeira acima
          </p>
        </div>
      </ContainerMain>
    </Container>
  )
}
