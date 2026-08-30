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
            Your workspace
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-wide lg:text-4xl">
          Organize your finances
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl text-pretty md:text-base">
          Each organization has its own transactions, charts, and insights.
          Choose an existing one or create your first to get started
        </p>
      </div>

      <Button asChild>
        <Link href="/create-org">
          <CirclePlus className="size-4" />
          Create organization
        </Link>
      </Button>

      <div className="hidden justify-center items-center gap-2 text-muted-foreground md:flex">
        <Building2 className="size-4" />
        <p className="text-xs">
          If you already have an organization, ask the owner to invite you
        </p>
      </div>
    </>
  )
}
