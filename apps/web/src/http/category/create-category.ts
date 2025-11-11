import { api } from '../api-client'

interface CreateCategoryRequest {
  organization: string
  name: string
  color: string
  type: 'EXPENSE' | 'REVENUE'
}

interface CreateCategoryResponse {
  categoryId: string
}

export async function createCategory({
  organization,
  name,
  color,
  type,
}: CreateCategoryRequest): Promise<CreateCategoryResponse> {
  const response = await api
    .post(`organizations/${organization}/categories`, {
      json: {
        name,
        color,
        type,
      },
    })
    .json<CreateCategoryResponse>()

  return response
}
