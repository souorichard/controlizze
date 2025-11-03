import { Metadata } from 'next'

import { getCurrentOrganization } from '@/auth/auth'

import { BalanceCard } from './_components/balance-card'
import { ExpensesCard } from './_components/expenses-card'
import { RevenuesCard } from './_components/revenues-card'
import { TransactionPerPeriodCard } from './_components/transactions-per-period-card'

export const metadata: Metadata = {
  title: 'Overview',
}

export default async function OverviewPage() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold md:text-2xl">Overview</h1>
        <p className="text-muted-foreground">
          Detailed analysis of your transactions.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid items-center gap-4 lg:grid-cols-3">
          <ExpensesCard organization={currentOrganization!} />
          <RevenuesCard organization={currentOrganization!} />
          <BalanceCard organization={currentOrganization!} />
        </div>
        <TransactionPerPeriodCard organization={currentOrganization!} />
        <div className="grid items-center gap-4 lg:grid-cols-2">
          {/* <ExpenseCategoriesCard organization={currentOrganization!} />
          <RevenueCategoriesCard organization={currentOrganization!} /> */}
        </div>
      </div>
    </>
  )
}
