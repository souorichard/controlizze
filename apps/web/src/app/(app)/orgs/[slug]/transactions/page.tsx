import { Metadata } from 'next'

import { getCurrentOrganization } from '@/auth/auth'

import { Filters } from './_components/filters'
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
          View all transactions of this organization.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Filters />
        <TransactionsTable organization={currentOrganization!} />
      </div>
    </>
  )
}
