import { api } from '../api-client'

interface DeleteTransactionRequest {
  org: string
  transactionId: string
}

type DeleteTransactionResponse = void

export async function deleteTransaction({
  org,
  transactionId,
}: DeleteTransactionRequest): Promise<DeleteTransactionResponse> {
  const response = await api
    .delete(`orgs/${org}/transactions/${transactionId}`, {
      next: {
        tags: [`${org}/transactions`],
      },
    })
    .json<DeleteTransactionResponse>()

  return response
}
