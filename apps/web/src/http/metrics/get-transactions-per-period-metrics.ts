import { api } from '../api-client'

interface GetTransactionsPerPeriodMetricsRequest {
  org: string
  lastMonths?: string
}

interface GetTransactionsPerPeriodMetricsResponse {
  transactions: {
    date: string
    expenses: number
    incomes: number
  }[]
}

export async function getTransactionsPerPeriodMetrics({
  org,
  lastMonths,
}: GetTransactionsPerPeriodMetricsRequest) {
  const response = await api
    .get(`orgs/${org}/metrics/transactions-per-period`, {
      searchParams: {
        lastMonths,
      },
      next: {
        tags: [`${org}/metrics/transactions-per-period`],
      },
    })
    .json<GetTransactionsPerPeriodMetricsResponse>()

  return response
}
