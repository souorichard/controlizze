import { api } from '../api-client'

interface GetTopExpenseCategoriesMetricsRequest {
  org: string
}

interface GetTopExpenseCategoriesMetricsResponse {
  categories: {
    category: string
    amount: number
  }[]
}

export async function getTopExpenseCategoriesMetrics({
  org,
}: GetTopExpenseCategoriesMetricsRequest): Promise<GetTopExpenseCategoriesMetricsResponse> {
  const response = await api
    .get(`/orgs/${org}/metrics/top-expense-categories`, {
      next: {
        tags: [`${org}/metrics/top-expense-categories`],
      },
    })
    .json<GetTopExpenseCategoriesMetricsResponse>()

  return response
}
