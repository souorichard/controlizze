import { api } from '../api-client'

interface GetBalanceEvolutionMetricsRequest {
  org: string
  year?: string
}

interface GetBalanceEvolutionMetricsResponse {
  evolutions: {
    date: string
    balance: number
  }[]
}

export async function getBalanceEvolutionMetrics({
  org,
  year,
}: GetBalanceEvolutionMetricsRequest) {
  const response = await api
    .get(`orgs/${org}/metrics/balance-evolution`, {
      searchParams: {
        year,
      },
      next: {
        tags: [`${org}/metrics/balance-evolution`],
      },
    })
    .json<GetBalanceEvolutionMetricsResponse>()

  return response
}
