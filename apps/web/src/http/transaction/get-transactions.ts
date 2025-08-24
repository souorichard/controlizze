import { api } from '../api-client'

interface GetTransactionsRequest {
  organization: string
  page?: string | null
  perPage?: string | null
}

interface GetTransactionsResponse {
  transactions: {
    id: string
    description: string
    category: string
    type: 'EXPENSE' | 'REVENUE'
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
    amount: number
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
    createdAt: string
  }[]
  pageSubtotal: number
  totalAmount: number
  totalCount: number
}

export async function getTransactions({
  organization,
  page,
  perPage,
}: GetTransactionsRequest) {
  const pageNumber = page ?? '1'
  const perPageNumber = perPage ?? '10'

  const response = await api
    .get(
      `organizations/${organization}/transactions?page=${pageNumber}&perPage=${perPageNumber}`,
      {
        next: {
          tags: [`${organization}/transactions`],
        },
      },
    )
    .json<GetTransactionsResponse>()

  return response
}
