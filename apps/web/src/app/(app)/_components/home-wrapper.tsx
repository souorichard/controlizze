'use client'

import { Astroid, Building2, CirclePlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HomeWrapper() {
  return (
    <>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex justify-center items-center">
          <span className="px-2.5 py-1 flex items-center gap-2 bg-primary/10 border border-primary rounded-full text-xs text-primary">
            <Astroid className="size-3 text-primary animate-pulse" />
            Sua área de trabalho
          </span>
        </div>

        <h1 className="text-2xl font-semibold font-heading tracking-wide lg:text-5xl">
          Organize suas finanças
          {/* <span className="bg-linear-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent animate-shimmer">
            Controlizze
          </span> */}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-pretty lg:text-lg">
          Cada organização tem suas próprias transações, gráficos e insights.
          Escolha uma existente ou crie sua primeira para começar
        </p>
      </div>

      <Button size="lg" asChild>
        <Link href="/create-org">
          <CirclePlus className="size-5" />
          Nova organização
        </Link>
      </Button>

      <div className="flex justify-center items-center gap-2 text-muted-foreground">
        <Building2 className="size-4" />
        <p className="text-xs">
          Se você ainda não tem nenhuma organização. Crie a primeira acima
        </p>
      </div>
    </>
  )
}
