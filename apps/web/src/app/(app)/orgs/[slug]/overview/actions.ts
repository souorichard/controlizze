'use server'

import { getTransactionsAmountMetrics } from '@/http/metrics/get-transactions-amount-metrics'
import { getTransactionsBalanceAmountMetrics } from '@/http/metrics/get-transactions-balance-amount-metrics'
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
