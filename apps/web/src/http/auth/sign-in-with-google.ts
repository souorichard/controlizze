import { api } from '../api-client'

interface SignInWithGoogleRequest {
  code: string
}

interface SignInWithGoogleResponse {
  token: string
}

export async function signInWithGoogle({
  code,
}: SignInWithGoogleRequest): Promise<SignInWithGoogleResponse> {
  const response = await api
    .post('sessions/google', {
      json: {
        code,
      },
    })
    .json<SignInWithGoogleResponse>()

  return response
}
