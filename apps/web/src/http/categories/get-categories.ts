import type { CategoriesFilter, Category } from '@/interfaces/category'
import { api } from '../api-client'

interface GetCategoriesRequest {
  org: string
  filters?: CategoriesFilter
}

interface GetCategoriesResponse {
  categories: Category[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export async function getCategories({ org, filters }: GetCategoriesRequest) {
  const response = await api
    .get(`orgs/${org}/categories`, {
      searchParams: {
        ...filters,
      },
      next: {
        tags: [`${org}/categories`],
      },
    })
    .json<GetCategoriesResponse>()

  return response
}
