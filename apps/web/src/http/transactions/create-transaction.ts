import { api } from '../api-client'

interface CreateTransactionRequest {
  org: string
  title: string
  description?: string
  type: string
  categoryId: string
  amount: number
  status: string
  transactionDate: string
}

type CreateTransactionResponse = void

export async function createTransaction({
  org,
  title,
  description,
  type,
  categoryId,
  amount,
  status,
  transactionDate,
}: CreateTransactionRequest): Promise<CreateTransactionResponse> {
  const response = await api
    .post(`orgs/${org}/transactions`, {
      json: {
        title,
        description,
        type,
        categoryId,
        amount,
        status,
        transactionDate,
      },
      next: {
        tags: [`${org}/transactions`],
      },
    })
    .json<CreateTransactionResponse>()

  return response
}
