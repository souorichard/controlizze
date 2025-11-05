import { Metadata } from 'next'

import { getCurrentOrganization } from '@/auth/auth'
import { TransactionForm } from '@/components/transaction-form'

export const metadata: Metadata = {
  title: 'Transactions: Create',
}

export default async function CreateTransactionPage() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <>
      <h1 className="text-xl font-semibold md:text-2xl">Create transaction</h1>

      <TransactionForm organization={currentOrganization!} />
    </>
  )
}
