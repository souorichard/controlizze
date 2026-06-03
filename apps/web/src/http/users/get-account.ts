import { api } from '../api-client'

interface GetAccountResponse {
  user: {
    id: string
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

export async function getAccount(): Promise<GetAccountResponse> {
  const response = await api
    .get('/me', {
      next: {
        tags: ['me'],
      },
    })
    .json<GetAccountResponse>()

  return response
}
