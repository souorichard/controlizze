'use server'

import { revalidateTag } from 'next/cache'
import { createTransaction } from '@/http/transactions/create-transaction'
import { getTransactions } from '@/http/transactions/get-transactions'
import type { TransactionsFilter } from '@/interfaces/transaction'
import { actionError } from '@/utils/action-error'
import { getCurrentOrg } from '@/utils/auth'
import type { UpsertTransactionFormData } from './schemas'

export async function createTransactionAction({
  title,
  description,
  type,
  category,
  amount,
  status,
  transactionDate,
}: UpsertTransactionFormData) {
  const currentOrg = await getCurrentOrg()

  try {
    await createTransaction({
      org: currentOrg as string,
      title,
      description,
      type: type.toUpperCase(),
      categoryId: category,
      amount: Number(amount),
      status: status.toUpperCase(),
      transactionDate,
    })

    revalidateTag(`${currentOrg}/transactions`, 'max')
  } catch (error) {
    await actionError(error)
  }

  return {
    success: true,
    message: 'Successfully created transaction',
  }
}

export async function getTransactionsAction({
  page,
  perPage,
  title,
  type,
  category,
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
      type: type?.toUpperCase() as 'EXPENSE' | 'INCOME' | undefined,
      categorySlug: category,
      status: status?.toUpperCase() as
        | 'PENDING'
        | 'PAID'
        | 'CANCELED'
        | undefined,
      startDate,
      endDate,
    },
  })

  return {
    transactions,
    meta,
  }
}
