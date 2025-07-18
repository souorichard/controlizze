import { api } from './api-client'

interface RecoverPasswordRequest {
  email: string
}

type RecoverPasswordResponse = void

export async function recoverPassword({
  email,
}: RecoverPasswordRequest): Promise<RecoverPasswordResponse> {
  await api.post('password/recover', {
    json: {
      email,
    },
  })
}
