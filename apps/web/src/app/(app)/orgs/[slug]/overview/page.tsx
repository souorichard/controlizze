import { Metadata } from 'next'

import { getCurrentOrganization } from '@/auth/auth'
import { getSubscription } from '@/http/billing/get-subscription'

import { BalanceCard } from './_components/balance-card'
import { BalanceEvolutionCard } from './_components/balance-evolution-card'
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

  const { subscription } = await getSubscription(currentOrganization!)

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold md:text-2xl">Overview</h1>
        <p className="text-muted-foreground">
          Detailed analysis of your transactions
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid items-center gap-4 lg:grid-cols-3">
          <ExpensesCard />
          <RevenuesCard />
          <BalanceCard />
        </div>
        {subscription.name !== 'free' && (
          <>
            <TransactionPerPeriodCard />
            <BalanceEvolutionCard />
          </>
        )}

        <div className="grid items-center gap-4 lg:grid-cols-2">
          <ExpenseCategoriesCard />
          <RevenueCategoriesCard />
        </div>
      </div>
    </>
  )
}
