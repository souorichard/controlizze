import { CirclePlus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import { getCurrentOrganization } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { LiveDescriptionFilter } from './_components/filters/live-description-filter'
import { TransactionsFiltersDialog } from './_components/filters/transactions-filters-dialog'
import { TransactionsTable } from './_components/transactions-table'

export const metadata: Metadata = {
  title: 'Transactions',
}

export default async function TransactionsPage() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold md:text-2xl">Transactions</h1>
        <p className="text-muted-foreground">
          View all transactions of this organization
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <LiveDescriptionFilter />
            <TransactionsFiltersDialog />
          </div>
          <Separator orientation="vertical" className="hidden h-5! lg:block" />
          <Button className="w-full lg:w-auto" asChild>
            <Link href={`/orgs/${currentOrganization}/create-transaction`}>
              <CirclePlus className="size-4" />
              New transaction
            </Link>
          </Button>
        </div>
        <TransactionsTable />
      </div>
    </>
  )
}
