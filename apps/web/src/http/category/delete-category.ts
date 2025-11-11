import { api } from '../api-client'

interface DeleteCategoryRequest {
  organization: string
  categoryId: string
}

type DeleteCategoryResponse = void

export async function deleteCategory({
  organization,
  categoryId,
}: DeleteCategoryRequest): Promise<DeleteCategoryResponse> {
  const response = await api
    .delete(`organizations/${organization}/categories/${categoryId}`, {
      next: {
        tags: [`${organization}/categories`],
      },
    })
    .json<DeleteCategoryResponse>()

  return response
}
