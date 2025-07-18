import { api } from './api-client'

interface RecoverPasswordRequest {
  code: string
  password: string
}

type RecoverPasswordResponse = void

export async function resetPassword({
  code,
  password,
}: RecoverPasswordRequest): Promise<RecoverPasswordResponse> {
  await api.post('password/reset', {
    json: {
      code,
      password,
    },
  })
}
