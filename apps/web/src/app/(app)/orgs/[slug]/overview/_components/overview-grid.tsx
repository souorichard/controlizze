import { BalanceCard } from './cards/balance-card'
import { BalanceEvolutionCard } from './cards/balance-evolution-card'
import { ExpensesCard } from './cards/expenses-card'
import { IncomesCard } from './cards/incomes-card'
import { MonthlyExpensesCard } from './cards/monthly-expenses-card'
import { SavingsRateCard } from './cards/savings-rate-card'
import { TopExpenseCategoriesCard } from './cards/top-expense-categories-card'
import { TransactionsPerPeriodCard } from './cards/transactions-per-period-card'

export function OverviewGrid() {
  return (
    <div className="grid items-center gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <IncomesCard className="col-span-1" />
      <ExpensesCard className="col-span-1" />
      <SavingsRateCard className="col-span-1" />
      <BalanceCard className="col-span-1" />
      <TransactionsPerPeriodCard className="col-span-full" />
      <BalanceEvolutionCard className="col-span-full" />
      <TopExpenseCategoriesCard className="col-span-full lg:col-span-2" />
      <MonthlyExpensesCard className="col-span-full lg:col-span-2" />
    </div>
  )
}
