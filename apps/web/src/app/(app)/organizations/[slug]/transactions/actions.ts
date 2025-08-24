'use server'

import { HTTPError } from 'ky'

import { getCurrentOrganization } from '@/auth/auth'
import { UpsertTransactionFormData } from '@/components/transaction-form'
import { createTransaction } from '@/http/transaction/create-transaction'
import { deleteTransaction } from '@/http/transaction/delete-transaction'
import { getTransactions } from '@/http/transaction/get-transactions'
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

export async function getTransactionsAction() {
  const currentOrganization = await getCurrentOrganization()

  const { transactions, subtotal, total } = await getTransactions(
    currentOrganization!,
  )

  const transactionsWithFormattedAmount = transactions.map((transaction) => ({
    ...transaction,
    amount: centsToReal(transaction.amount),
  }))

  return {
    transactions: transactionsWithFormattedAmount,
    subtotal: centsToReal(subtotal),
    total: centsToReal(total),
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
