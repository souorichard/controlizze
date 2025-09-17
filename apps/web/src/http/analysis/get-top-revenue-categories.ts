import { api } from '../api-client'

interface GetTopRevenueCategoriesRequest {
  organization: string
}

interface GetTopRevenueCategoriesResponse {
  categories: {
    category: string
    amount: number
  }[]
}

export async function getTopRevenueCategories({
  organization,
}: GetTopRevenueCategoriesRequest) {
  const response = await api
    .get(`organizations/${organization}/analysis/top-revenue-categories`, {
      next: {
        tags: [`${organization}/analysis/top-revenue-categories`],
      },
    })
    .json<GetTopRevenueCategoriesResponse>()

  return response
}
