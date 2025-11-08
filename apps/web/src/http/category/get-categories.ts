import { api } from '../api-client'

interface GetCategoriesRequest {
  organization: string
}

interface GetCategoriesResponse {
  categories: {
    id: string
    name: string
    slug: string
    color: string
    type: 'EXPENSE' | 'REVENUE'
    createdAt: string
  }[]
}

export async function getCategories({ organization }: GetCategoriesRequest) {
  const response = await api
    .get(`organizations/${organization}/categories`, {
      next: {
        tags: [`${organization}/categories`],
      },
    })
    .json<GetCategoriesResponse>()

  return response
}
