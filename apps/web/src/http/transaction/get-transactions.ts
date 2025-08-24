import { api } from '../api-client'

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
  subtotal: number
  total: number
}

export async function getTransactions(organization: string) {
  const response = await api
    .get(`organizations/${organization}/transactions`, {
      next: {
        tags: [`${organization}/transactions`],
      },
    })
    .json<GetTransactionsResponse>()

  return response
}
