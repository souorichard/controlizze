import { api } from '../api-client'

interface ResetPasswordRequest {
  code: string
  password: string
}

type ResetPasswordResponse = void

export async function resetPassword({
  code,
  password,
}: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  await api.post('/sessions/forgot-password/reset', {
    searchParams: {
      code,
    },
    json: {
      password,
    },
  })
}
