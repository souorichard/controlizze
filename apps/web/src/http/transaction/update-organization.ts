import { api } from '../api-client'

interface UpdateTransactionRequest {
  organization: string
  transactionId: string
  description: string
  type: 'EXPENSE' | 'REVENUE'
  category: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  amount: number
}

type UpdateTransactionResponse = void

export async function updateTransaction({
  organization,
  transactionId,
  description,
  type,
  category,
  status,
  amount,
}: UpdateTransactionRequest): Promise<UpdateTransactionResponse> {
  const response = await api
    .put(`organizations/${organization}/transactions/${transactionId}`, {
      json: {
        description,
        type,
        category,
        status,
        amount,
      },
    })
    .json<UpdateTransactionResponse>()

  return response
}
