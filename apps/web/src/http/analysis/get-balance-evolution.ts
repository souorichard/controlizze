import dayjs from 'dayjs'

import { api } from '../api-client'

interface GetBalanceEvolutionRequest {
  organization: string
  year?: string
}

interface GetBalanceEvolutionResponse {
  evolutions: {
    date: string
    balance: number
  }[]
}

export async function getBalanceEvolution({
  organization,
  year,
}: GetBalanceEvolutionRequest) {
  const searchParams = new URLSearchParams({
    year: year ?? dayjs().year().toString(),
  })

  const response = await api
    .get(`organizations/${organization}/analysis/balance-evolution`, {
      searchParams,
      next: {
        tags: [`${organization}/analysis/balance-evolution`],
      },
    })
    .json<GetBalanceEvolutionResponse>()

  return response
}
