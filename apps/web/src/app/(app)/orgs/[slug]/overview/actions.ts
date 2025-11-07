'use server'

import { getCurrentOrganization } from '@/auth/auth'
import { getExpensesAmount } from '@/http/analysis/get-expenses-amount'
import { getRevenuesAmount } from '@/http/analysis/get-revenues-amount'
import { getTopExpenseCategories } from '@/http/analysis/get-top-expense-categories'
import { getTopRevenueCategories } from '@/http/analysis/get-top-revenue-categories'
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
  lastMonths: string
}

export async function getTransactionsPerPeriodAction({
  lastMonths,
}: GetTransactionsPerPeriodActionProps) {
  const currentOrganization = await getCurrentOrganization()

  const dailyTransactions = await getTransactionsPerPeriod({
    organization: currentOrganization!,
    lastMonths,
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

export async function getTopExpenseCategoriesAction() {
  const currentOrganization = await getCurrentOrganization()

  const topExpenseCategories = await getTopExpenseCategories({
    organization: currentOrganization!,
  })

  const formattedTopExpenseCategories = topExpenseCategories.categories.map(
    (category) => ({
      ...category,
      amount: centsToReal(category.amount),
    }),
  )

  return formattedTopExpenseCategories
}

export async function getTopRevenueCategoriesAction() {
  const currentOrganization = await getCurrentOrganization()

  const topRevenueCategories = await getTopRevenueCategories({
    organization: currentOrganization!,
  })

  const formattedTopRevenueCategories = topRevenueCategories.categories.map(
    (category) => ({
      ...category,
      amount: centsToReal(category.amount),
    }),
  )

  return formattedTopRevenueCategories
}
