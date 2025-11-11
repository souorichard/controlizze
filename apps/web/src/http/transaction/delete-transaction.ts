import { api } from '../api-client'

interface DeleteTransactionRequest {
  organization: string
  transactionId: string
}

type DeleteTransactionResponse = void

export async function deleteTransaction({
  organization,
  transactionId,
}: DeleteTransactionRequest): Promise<DeleteTransactionResponse> {
  const response = await api
    .delete(`organizations/${organization}/transactions/${transactionId}`, {
      next: {
        tags: [`${organization}/transactions`],
      },
    })
    .json<DeleteTransactionResponse>()

  return response
}
