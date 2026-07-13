'use server'

import { getTransactions } from '@/http/transactions/get-transactions'
import type { TransactionsFilter } from '@/interfaces/transaction-interface'
import { getCurrentOrg } from '@/utils/auth'

export async function getTransactionsAction({
  page,
  perPage,
  title,
  type,
  status,
  startDate,
  endDate,
}: TransactionsFilter) {
  const currentOrg = await getCurrentOrg()

  const { transactions, meta } = await getTransactions({
    org: currentOrg as string,
    filters: {
      page: Number(page),
      perPage: Number(perPage),
      title,
      type,
      status,
      startDate,
      endDate,
    },
  })

  return {
    transactions,
    meta,
  }
}
