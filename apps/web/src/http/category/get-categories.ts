import { Category } from '@/interfaces/category'

import { api } from '../api-client'

interface GetCategoriesRequest {
  organization: string
  page?: string
  perPage?: string
  name?: string
  type?: string
}

interface GetCategoriesResponse {
  rawCategories: Category[]
  categories: Category[]
  totalCount: number
}

export async function getCategories({
  organization,
  page,
  perPage,
  name,
  type,
}: GetCategoriesRequest) {
  const pageNumber = page ?? '1'
  const perPageNumber = perPage ?? '10'

  const searchParams = new URLSearchParams({
    page: pageNumber,
    perPage: perPageNumber,
  })

  if (name) searchParams.append('name', name)
  if (type) searchParams.append('type', type)

  const response = await api
    .get(`organizations/${organization}/categories`, {
      searchParams,
      next: {
        tags: [`${organization}/categories`],
      },
    })
    .json<GetCategoriesResponse>()

  return response
}
