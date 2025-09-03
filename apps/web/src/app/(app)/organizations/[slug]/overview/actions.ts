'use server'

import { getCurrentOrganization } from '@/auth/auth'
import { getExpensesAmount } from '@/http/analysis/get-expenses-amount'
import { getRevenuesAmount } from '@/http/analysis/get-revenues-amount'
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

  console.log(revenuesAmount)

  return {
    amount: centsToReal(revenuesAmount.amount),
    diffFromLastMonth: revenuesAmount.diffFromLastMonth,
  }
}
