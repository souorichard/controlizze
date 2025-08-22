import { api } from '../api-client'

interface CreateTransactionRequest {
  organization: string
  description: string
  category: string
  type: 'EXPENSE' | 'REVENUE'
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  amount: number
}

interface CreateTransactionResponse {
  transactionId: string
}

export async function createTransaction({
  organization,
  description,
  category,
  type,
  status,
  amount,
}: CreateTransactionRequest): Promise<CreateTransactionResponse> {
  const response = await api
    .post(`organizations/${organization}/transactions`, {
      json: {
        description,
        category,
        type,
        status,
        amount,
      },
    })
    .json<CreateTransactionResponse>()

  return response
}
