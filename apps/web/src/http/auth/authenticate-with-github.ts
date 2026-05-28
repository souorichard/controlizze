import { api } from '../api-client'

interface AuthenticateWithGithubRequest {
  code: string
}

interface AuthenticateWithGithubResponse {
  token: string
}

export async function authenticateWithGithub({
  code,
}: AuthenticateWithGithubRequest): Promise<AuthenticateWithGithubResponse> {
  const response = await api
    .post('/sessions/github', {
      json: {
        code,
      },
    })
    .json<AuthenticateWithGithubResponse>()

  return response
}
