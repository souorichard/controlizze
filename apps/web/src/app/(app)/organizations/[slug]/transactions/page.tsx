import { Metadata } from 'next'

import { getCurrentOrganization } from '@/auth/auth'

import { TransactionsTable } from './_components/transactions-table'

export const metadata: Metadata = {
  title: 'Transactions',
}

export default async function TransactionsPage() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <>
      <h1 className="text-xl font-semibold md:text-2xl">Transactions</h1>
      <div className="flex flex-col gap-6">
        <TransactionsTable organization={currentOrganization!} />
      </div>
    </>
  )
}
