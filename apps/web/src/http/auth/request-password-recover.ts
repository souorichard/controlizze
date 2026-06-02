import { api } from '../api-client'

interface RequestPasswordRecoverRequest {
  email: string
}

type RequestPasswordRecoverResponse = void

export async function requestPasswordRecover({
  email,
}: RequestPasswordRecoverRequest): Promise<RequestPasswordRecoverResponse> {
  await api.post('/sessions/forgot-password', {
    json: {
      email,
    },
  })
}
