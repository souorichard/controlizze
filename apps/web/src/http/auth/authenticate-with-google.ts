import { api } from '../api-client'

interface AuthenticateWithGoogleRequest {
  code: string
}

interface AuthenticateWithGoogleResponse {
  token: string
}

export async function authenticateWithGoogle({
  code,
}: AuthenticateWithGoogleRequest): Promise<AuthenticateWithGoogleResponse> {
  const response = await api
    .post('/sessions/google', {
      json: {
        code,
      },
    })
    .json<AuthenticateWithGoogleResponse>()

  return response
}
