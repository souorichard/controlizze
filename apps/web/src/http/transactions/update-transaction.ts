import { api } from '../api-client'

interface UpdateTransactionRequest {
  org: string
  transactionId: string
  title: string
  description?: string
  type: string
  categoryId: string
  amount: number
  status: string
  transactionDate: string
}

type UpdateTransactionResponse = void

export async function updateTransaction({
  org,
  transactionId,
  title,
  description,
  type,
  categoryId,
  amount,
  status,
  transactionDate,
}: UpdateTransactionRequest): Promise<UpdateTransactionResponse> {
  const response = await api
    .put(`orgs/${org}/transactions/${transactionId}`, {
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
    .json<UpdateTransactionResponse>()

  return response
}
