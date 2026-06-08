import { api } from '../api-client'

interface GetMonthlyExpensesMetricsRequest {
  org: string
}

interface GetMonthlyExpensesMetricsResponse {
  expenses: {
    date: string
    amount: number
  }[]
}

export async function getMonthlyExpensesMetrics({
  org,
}: GetMonthlyExpensesMetricsRequest): Promise<GetMonthlyExpensesMetricsResponse> {
  const response = await api
    .get(`/orgs/${org}/metrics/monthly-expenses`, {
      next: {
        tags: [`${org}/metrics/monthly-expenses`],
      },
    })
    .json<GetMonthlyExpensesMetricsResponse>()

  return response
}
