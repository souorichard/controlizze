'use server'

import { getCurrentOrganization } from '@/auth/auth'
import { getExpensesAmount } from '@/http/analysis/get-expenses-amount'
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
