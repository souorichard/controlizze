import { api } from '../api-client'

interface CreateAccountRequest {
  name: string
  email: string
  password: string
}

type CreateAccountResponse = void

export async function createAccount({
  name,
  email,
  password,
}: CreateAccountRequest): Promise<CreateAccountResponse> {
  await api
    .post('/accounts', {
      json: {
        name,
        email,
        password,
      },
    })
    .json<CreateAccountResponse>()
}
