import { api } from '../api-client'

interface GetTransactionsPerPeriodRequest {
  organization: string
  lastMonths?: string
}

interface GetTransactionsPerPeriodResponse {
  transactions: {
    date: string
    expenses: number
    revenues: number
  }[]
}

export async function getTransactionsPerPeriod({
  organization,
  lastMonths,
}: GetTransactionsPerPeriodRequest) {
  const searchParams = new URLSearchParams({
    lastMonths: lastMonths ?? '1',
  })

  const response = await api
    .get(`organizations/${organization}/analysis/transactions-per-period`, {
      searchParams,
      next: {
        tags: [`${organization}/analysis/transactions-per-period`],
      },
    })
    .json<GetTransactionsPerPeriodResponse>()

  return response
}
