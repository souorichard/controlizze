import type { Metadata } from 'next'
import {
  ContainerWrapper,
  ContainerWrapperDescription,
  ContainerWrapperHeader,
  ContainerWrapperTitle,
} from '@/components/container'
import { BalanceCard } from './_components/balance-card'
import { ExpensesCard } from './_components/expenses-card'
import { IncomesCard } from './_components/incomes-card'

export const metadata: Metadata = {
  title: 'Overview',
}

export default function OverviewPage() {
  return (
    <ContainerWrapper>
      <ContainerWrapperHeader>
        <ContainerWrapperTitle>
          Insights{' '}
          <span className="bg-linear-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent animate-shimmer">
            financeiros
          </span>
        </ContainerWrapperTitle>
        <ContainerWrapperDescription>
          Transforme dados financeiros em decisões mais inteligentes
        </ContainerWrapperDescription>
      </ContainerWrapperHeader>

      <div className="flex flex-col gap-4">
        <div className="grid items-center gap-4 lg:grid-cols-3">
          <ExpensesCard />
          <IncomesCard />
          <BalanceCard />
        </div>
      </div>
    </ContainerWrapper>
  )
}
