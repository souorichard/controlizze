import { api } from '../api-client'

interface UpdateTransactionRequest {
  organization: string
  transactionId: string
  description: string
  category: string
  type: 'EXPENSE' | 'REVENUE'
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  amount: number
}

type UpdateTransactionResponse = void

export async function updateTransaction({
  organization,
  transactionId,
  description,
  category,
  type,
  status,
  amount,
}: UpdateTransactionRequest): Promise<UpdateTransactionResponse> {
  const response = await api
    .put(`organizations/${organization}/transactions/${transactionId}`, {
      json: {
        description,
        category,
        type,
        status,
        amount,
      },
    })
    .json<UpdateTransactionResponse>()

  return response
}
