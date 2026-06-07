import { api } from '../api-client'

interface GetTransactionsBalanceAmountMetricsRequest {
  org: string
}

interface GetTransactionsBalanceAmountMetricsResponse {
  amount: number
  diffFromLastMonth: number | null
}

export async function getTransactionsBalanceAmountMetrics({
  org,
}: GetTransactionsBalanceAmountMetricsRequest): Promise<GetTransactionsBalanceAmountMetricsResponse> {
  const response = await api
    .get(`/orgs/${org}/metrics/transactions-balance`, {
      next: {
        tags: [`${org}/metrics/transactions-balance`],
      },
    })
    .json<GetTransactionsBalanceAmountMetricsResponse>()

  return response
}
