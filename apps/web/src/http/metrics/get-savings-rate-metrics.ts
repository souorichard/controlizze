import { api } from '../api-client'

interface GetSavingsRateMetricsRequest {
  org: string
}

interface GetSavingsRateMetricsResponse {
  rate: number
  transactionsCount: number
}

export async function getSavingsRateMetrics({
  org,
}: GetSavingsRateMetricsRequest): Promise<GetSavingsRateMetricsResponse> {
  const response = await api
    .get(`/orgs/${org}/metrics/savings-rate`, {
      next: {
        tags: [`${org}/metrics/savings-rate`],
      },
    })
    .json<GetSavingsRateMetricsResponse>()

  return response
}
