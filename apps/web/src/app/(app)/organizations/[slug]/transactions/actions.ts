'use server'

import { getCurrentOrganization } from '@/auth/auth'
import { getTransactions } from '@/http/transaction/get-transactions'

export async function getTransactionsAction() {
  const currentOrganization = await getCurrentOrganization()

  const { transactions } = await getTransactions(currentOrganization!)

  return {
    transactions,
  }
}
