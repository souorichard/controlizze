import { api } from '../api-client'

interface CreateTransactionRequest {
  organization: string
  description: string
  type: 'EXPENSE' | 'REVENUE'
  category: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  amount: number
}

interface CreateTransactionResponse {
  transactionId: string
}

export async function createTransaction({
  organization,
  description,
  type,
  category,
  status,
  amount,
}: CreateTransactionRequest): Promise<CreateTransactionResponse> {
  const response = await api
    .post(`organizations/${organization}/transactions`, {
      json: {
        description,
        type,
        category,
        status,
        amount,
      },
    })
    .json<CreateTransactionResponse>()

  return response
}
