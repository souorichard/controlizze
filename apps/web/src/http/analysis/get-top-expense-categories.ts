import { api } from '../api-client'

interface GetTopExpenseCategoriesRequest {
  organization: string
}

interface GetTopExpenseCategoriesResponse {
  categories: {
    category: string
    amount: number
  }[]
}

export async function getTopExpenseCategories({
  organization,
}: GetTopExpenseCategoriesRequest) {
  const response = await api
    .get(`organizations/${organization}/analysis/top-expense-categories`, {
      next: {
        tags: [`${organization}/analysis/top-expense-categories`],
      },
    })
    .json<GetTopExpenseCategoriesResponse>()

  return response
}
