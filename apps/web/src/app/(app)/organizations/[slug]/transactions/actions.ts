'use server'

import { HTTPError } from 'ky'

import { getCurrentOrganization } from '@/auth/auth'
import { UpsertTransactionFormData } from '@/components/transaction-form'
import { createTransaction } from '@/http/transaction/create-transaction'
import { getTransactions } from '@/http/transaction/get-transactions'
import { ActionResponse } from '@/interfaces/action-response'

export async function createTransactionAction({
  description,
  category,
  type,
  status,
  amount,
}: UpsertTransactionFormData): Promise<ActionResponse> {
  const currentOrganization = await getCurrentOrganization()

  try {
    await createTransaction({
      organization: currentOrganization!,
      description,
      category,
      type,
      status,
      amount: Number(amount),
    })
  } catch (error) {
    if (error instanceof HTTPError) {
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

  const { transactions } = await getTransactions(currentOrganization!)

  return {
    transactions,
  }
}
