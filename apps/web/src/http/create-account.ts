import { api } from './api-client'

interface SignInWithPasswordRequest {
  name: string
  email: string
  password: string
}

type SignInWithPasswordResponse = void

export async function createAccount({
  name,
  email,
  password,
}: SignInWithPasswordRequest): Promise<SignInWithPasswordResponse> {
  await api
    .post('users', {
      json: {
        name,
        email,
        password,
      },
    })
    .json<SignInWithPasswordResponse>()
}
