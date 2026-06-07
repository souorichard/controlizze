'use server'

import { getBalanceEvolutionMetrics } from '@/http/metrics/get-balance-evolution-metrics'
import { getSavingsRateMetrics } from '@/http/metrics/get-savings-rate-metrics'
import { getTransactionsAmountMetrics } from '@/http/metrics/get-transactions-amount-metrics'
import { getTransactionsBalanceAmountMetrics } from '@/http/metrics/get-transactions-balance-amount-metrics'
import { getTransactionsPerPeriodMetrics } from '@/http/metrics/get-transactions-per-period-metrics'
import { getCurrentOrg } from '@/utils/auth'

interface GetTransactionsAmountMetricsActionProps {
  type: 'EXPENSE' | 'INCOME'
  accumulated?: boolean
}

export async function getTransactionsAmountMetricsAction({
  type,
  accumulated,
}: GetTransactionsAmountMetricsActionProps) {
  const currentOrg = await getCurrentOrg()

  const expenses = await getTransactionsAmountMetrics({
    org: currentOrg as string,
    type,
    accumulated,
  })

  return {
    amount: expenses.amount,
    diffFromLastMonth: expenses.diffFromLastMonth,
  }
}

export async function getSavingRateMetricsAction() {
  const currentOrg = await getCurrentOrg()

  const savings = await getSavingsRateMetrics({
    org: currentOrg as string,
  })

  return {
    rate: savings.rate,
    transactionsCount: savings.transactionsCount,
  }
}

export async function getTransactionsBalanceAmountMetricsAction() {
  const currentOrg = await getCurrentOrg()

  const balance = await getTransactionsBalanceAmountMetrics({
    org: currentOrg as string,
  })

  return {
    amount: balance.amount,
    diffFromLastMonth: balance.diffFromLastMonth,
  }
}

interface GetTransactionsPerPeriodMetricsActionProps {
  lastMonths?: string
}

export async function getTransactionsPerPeriodMetricsAction({
  lastMonths,
}: GetTransactionsPerPeriodMetricsActionProps) {
  const currentOrg = await getCurrentOrg()

  const { transactions } = await getTransactionsPerPeriodMetrics({
    org: currentOrg as string,
    lastMonths,
  })

  return transactions
}

interface GetBalanceEvolutionMetricsActionProps {
  year: string
}

export async function getBalanceEvolutionMetricsAction({
  year,
}: GetBalanceEvolutionMetricsActionProps) {
  const currentOrg = await getCurrentOrg()

  const { evolutions } = await getBalanceEvolutionMetrics({
    org: currentOrg as string,
    year,
  })

  return evolutions
}
