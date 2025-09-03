import { api } from '../api-client'

interface GetExpensesAmountRequest {
  organization: string
}

interface GetExpensesAmountResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getExpensesAmount({
  organization,
}: GetExpensesAmountRequest) {
  const response = await api
    .get(`organizations/${organization}/analysis/expenses-amount`, {
      next: {
        tags: [`${organization}/analysis/expenses-amount`],
      },
    })
    .json<GetExpensesAmountResponse>()

  return response
}
