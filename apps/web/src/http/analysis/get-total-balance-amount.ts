import { api } from '../api-client'

interface GetTotalBalanceAmountRequest {
  organization: string
}

interface GetTotalBalanceAmountResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getTotalBalanceAmount({
  organization,
}: GetTotalBalanceAmountRequest) {
  const response = await api
    .get(`organizations/${organization}/analysis/balance-amount`, {
      next: {
        tags: [`${organization}/analysis/balance-amount`],
      },
    })
    .json<GetTotalBalanceAmountResponse>()

  return response
}
