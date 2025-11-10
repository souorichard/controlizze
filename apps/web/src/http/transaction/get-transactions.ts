import { api } from '../api-client'

interface GetTransactionsRequest {
  organization: string
  page?: string
  perPage?: string
  description?: string
  type?: string
  category?: string
  status?: string
}

interface GetTransactionsResponse {
  transactions: {
    id: string
    description: string
    category: {
      name: string
      slug: string
    }
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
  description,
  type,
  category,
  status,
}: GetTransactionsRequest) {
  const pageNumber = page ?? '1'
  const perPageNumber = perPage ?? '10'

  const searchParams = new URLSearchParams({
    page: pageNumber,
    perPage: perPageNumber,
  })

  if (description) searchParams.append('description', description)
  if (type) searchParams.append('type', type)
  if (category) searchParams.append('category', category)
  if (status) searchParams.append('status', status)

  const response = await api
    .get(`organizations/${organization}/transactions`, {
      searchParams,
      next: {
        tags: [`${organization}/transactions`],
      },
    })
    .json<GetTransactionsResponse>()

  return response
}
