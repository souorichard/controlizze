import { Metadata } from 'next'

import { getCurrentOrganization } from '@/auth/auth'

import { BalanceCard } from './_components/balance-card'
import { ExpenseCategoriesCard } from './_components/expense-categories-card'
import { ExpensesCard } from './_components/expenses-card'
import { RevenueCategoriesCard } from './_components/revenue-categories-card'
import { RevenuesCard } from './_components/revenues-card'
import { TransactionPerPeriodCard } from './_components/transactions-per-period-card'

export const metadata: Metadata = {
  title: 'Overview',
}

export default async function OverviewPage() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <>
      <h1 className="text-xl font-semibold md:text-2xl">Overview</h1>
      <div className="flex flex-col gap-4">
        <div className="grid items-center gap-4 lg:grid-cols-3">
          <ExpensesCard organization={currentOrganization!} />
          <RevenuesCard organization={currentOrganization!} />
          <BalanceCard organization={currentOrganization!} />
        </div>
        <TransactionPerPeriodCard organization={currentOrganization!} />
        <div className="grid items-center gap-4 lg:grid-cols-2">
          <ExpenseCategoriesCard />
          <RevenueCategoriesCard />
        </div>
      </div>
    </>
  )
}
