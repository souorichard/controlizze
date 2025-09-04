'use server'

import { getCurrentOrganization } from '@/auth/auth'
import { getExpensesAmount } from '@/http/analysis/get-expenses-amount'
import { getRevenuesAmount } from '@/http/analysis/get-revenues-amount'
import { getTotalBalanceAmount } from '@/http/analysis/get-total-balance-amount'
import { getTransactionsPerPeriod } from '@/http/analysis/get-transactions-per-period'
import { centsToReal } from '@/utils/coin-converter'

export async function getExpensesAmountAction() {
  const currentOrganization = await getCurrentOrganization()

  const expensesAmount = await getExpensesAmount({
    organization: currentOrganization!,
  })

  return {
    amount: centsToReal(expensesAmount.amount),
    diffFromLastMonth: expensesAmount.diffFromLastMonth,
  }
}

export async function getRevenuesAmountAction() {
  const currentOrganization = await getCurrentOrganization()

  const revenuesAmount = await getRevenuesAmount({
    organization: currentOrganization!,
  })

  return {
    amount: centsToReal(revenuesAmount.amount),
    diffFromLastMonth: revenuesAmount.diffFromLastMonth,
  }
}

export async function getTotalBalanceAmountAction() {
  const currentOrganization = await getCurrentOrganization()

  const totalBalanceAmount = await getTotalBalanceAmount({
    organization: currentOrganization!,
  })

  return {
    amount: centsToReal(totalBalanceAmount.amount),
    diffFromLastMonth: totalBalanceAmount.diffFromLastMonth,
  }
}

interface GetTransactionsPerPeriodActionProps {
  from?: string
  to?: string
}

export async function getTransactionsPerPeriodAction({
  from,
  to,
}: GetTransactionsPerPeriodActionProps) {
  const currentOrganization = await getCurrentOrganization()

  const dailyTransactions = await getTransactionsPerPeriod({
    organization: currentOrganization!,
    from,
    to,
  })

  const formattedDailyTransactions = dailyTransactions.transactions.map(
    (transaction) => ({
      ...transaction,
      expenses: centsToReal(transaction.expenses),
      revenues: centsToReal(transaction.revenues),
    }),
  )

  return formattedDailyTransactions
}
