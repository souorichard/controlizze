import type {
  HttpTransactionsFilter,
  Transaction,
} from '@/interfaces/transaction-interface'
import { api } from '../api-client'

interface GetTransactionsRequest {
  org: string
  filters: HttpTransactionsFilter
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
  filters,
}: GetTransactionsRequest) {
  const response = await api
    .get(`orgs/${org}/transactions`, {
      searchParams: {
        ...filters,
      },
      next: {
        tags: [`${org}/transactions`],
      },
    })
    .json<GetTransactionsResponse>()

  return response
}
