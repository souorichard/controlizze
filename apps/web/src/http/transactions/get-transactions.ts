import type { Transaction } from '@/interfaces/transaction-interface'
import { api } from '../api-client'

interface GetTransactionsRequest {
  org: string
  page?: number
  perPage?: number
  title?: string
  type?: string
  status?: string
  startDate?: string
  endDate?: string
}

interface GetTransactionsResponse {
  transactions: Transaction[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export async function getTransactions({
  org,
  page,
  perPage,
  title,
  type,
  status,
  startDate,
  endDate,
}: GetTransactionsRequest) {
  const response = await api
    .get(`orgs/${org}/transactions`, {
      searchParams: {
        page,
        perPage,
        title,
        type,
        status,
        startDate,
        endDate,
      },
      next: {
        tags: [`${org}/transactions`],
      },
    })
    .json<GetTransactionsResponse>()

  return response
}
