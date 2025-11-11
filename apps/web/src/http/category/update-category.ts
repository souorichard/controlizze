import { api } from '../api-client'

interface UpdateCategoryRequest {
  organization: string
  categoryId: string
  name: string
  color: string
  type: 'EXPENSE' | 'REVENUE'
}

type UpdateCategoryResponse = void

export async function updateCategory({
  organization,
  categoryId,
  name,
  color,
  type,
}: UpdateCategoryRequest): Promise<UpdateCategoryResponse> {
  const response = await api
    .post(`organizations/${organization}/categories/${categoryId}`, {
      json: {
        name,
        color,
        type,
      },
    })
    .json<UpdateCategoryResponse>()

  return response
}
