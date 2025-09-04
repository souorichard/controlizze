import dayjs from 'dayjs'

import { api } from '../api-client'

interface GetTransactionsPerPeriodRequest {
  organization: string
  from?: string
  to?: string
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
  from,
  to,
}: GetTransactionsPerPeriodRequest) {
  const searchParams = new URLSearchParams({
    from: from ?? dayjs().subtract(7, 'days').toISOString(),
    to: to ?? dayjs().toISOString(),
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
