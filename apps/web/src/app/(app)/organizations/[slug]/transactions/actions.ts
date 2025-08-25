'use server'

import { HTTPError } from 'ky'

import { getCurrentOrganization } from '@/auth/auth'
import { UpsertTransactionFormData } from '@/components/transaction-form'
import { createTransaction } from '@/http/transaction/create-transaction'
import { deleteTransaction } from '@/http/transaction/delete-transaction'
import { getTransactions } from '@/http/transaction/get-transactions'
import { updateTransaction } from '@/http/transaction/update-organization'
import { ActionResponse } from '@/interfaces/action-response'
import { centsToReal, realToCents } from '@/utils/coin-converter'

export async function createTransactionAction({
  description,
  category,
  type,
  status,
  amount,
}: UpsertTransactionFormData): Promise<ActionResponse> {
  const currentOrganization = await getCurrentOrganization()

  try {
    const formattedAmount = realToCents(Number(amount))

    await createTransaction({
      organization: currentOrganization!,
      description,
      category,
      type,
      status,
      amount: formattedAmount,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Internal server error.',
    }
  }

  return {
    success: true,
    message: 'Transaction created successfully.',
  }
}

interface GetTransactionsActionProps {
  page: string | null
  // perPage?: string | null
}

export async function getTransactionsAction({
  page,
}: GetTransactionsActionProps) {
  const currentOrganization = await getCurrentOrganization()

  const { transactions, pageSubtotal, totalAmount, totalCount } =
    await getTransactions({
      organization: currentOrganization!,
      page: page ?? '1',
    })

  const transactionsWithFormattedAmount = transactions.map((transaction) => ({
    ...transaction,
    amount: centsToReal(transaction.amount),
  }))

  return {
    transactions: transactionsWithFormattedAmount,
    pageSubtotal: centsToReal(pageSubtotal),
    totalAmount: centsToReal(totalAmount),
    totalCount,
  }
}

export async function updateTransactionAction({
  transactionId,
  description,
  category,
  type,
  status,
  amount,
}: UpsertTransactionFormData & {
  transactionId: string
}): Promise<ActionResponse> {
  const currentOrganization = await getCurrentOrganization()

  try {
    const formattedAmount = realToCents(Number(amount))

    await updateTransaction({
      organization: currentOrganization!,
      transactionId,
      description,
      category,
      type,
      status,
      amount: formattedAmount,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Internal server error.',
    }
  }

  return {
    success: true,
    message: 'Transaction updated successfully.',
  }
}

interface DeleteTransactionActionProps {
  transactionId: string
}

export async function deleteTransactionAction({
  transactionId,
}: DeleteTransactionActionProps) {
  const currentOrganization = await getCurrentOrganization()

  await deleteTransaction({
    organization: currentOrganization!,
    transactionId,
  })
}
