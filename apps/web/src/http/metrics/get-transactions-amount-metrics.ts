import { api } from '../api-client'

interface GetTransactionsAmountMetricsRequest {
  org: string
  type: 'EXPENSE' | 'INCOME'
  accumulated?: boolean
}

interface GetTransactionsAmountMetricsResponse {
  amount: number
  diffFromLastMonth: number | null
}

export async function getTransactionsAmountMetrics({
  org,
  type,
  accumulated,
}: GetTransactionsAmountMetricsRequest): Promise<GetTransactionsAmountMetricsResponse> {
  const response = await api
    .get(`/orgs/${org}/metrics/transactions-amount`, {
      searchParams: {
        type,
        accumulated,
      },
      next: {
        tags: ['transactions-amount'],
      },
    })
    .json<GetTransactionsAmountMetricsResponse>()

  return response
}
