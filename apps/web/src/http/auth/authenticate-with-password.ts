import { api } from '../api-client'

interface AuthenticateWithPasswordRequest {
  email: string
  password: string
}

interface AuthenticateWithPasswordResponse {
  token: string
}

export async function authenticateWithPassword({
  email,
  password,
}: AuthenticateWithPasswordRequest): Promise<AuthenticateWithPasswordResponse> {
  const response = await api
    .post('/sessions', {
      json: {
        email,
        password,
      },
    })
    .json<AuthenticateWithPasswordResponse>()

  return response
}
