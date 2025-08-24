import { api } from '../api-client'

interface DeleteTransactionsRequest {
  organization: string
  transactionId: string
}

type DeleteTransactionsResponse = void

export async function deleteTransaction({
  organization,
  transactionId,
}: DeleteTransactionsRequest): Promise<DeleteTransactionsResponse> {
  const response = await api
    .delete(`organizations/${organization}/transactions/${transactionId}`, {
      next: {
        tags: [`${organization}/transactions`],
      },
    })
    .json<DeleteTransactionsResponse>()

  return response
}
