import { api } from '../api-client'

interface GetRevenuesAmountRequest {
  organization: string
}

interface GetRevenuesAmountResponse {
  amount: number
  diffFromLastMonth: number
}

export async function getRevenuesAmount({
  organization,
}: GetRevenuesAmountRequest) {
  const response = await api
    .get(`organizations/${organization}/analysis/revenues-amount`, {
      next: {
        tags: [`${organization}/analysis/revenues-amount`],
      },
    })
    .json<GetRevenuesAmountResponse>()

  return response
}
