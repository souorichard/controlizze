import { api } from '../api-client'

interface VerifyEmailRequest {
  code: string
}

type VerifyEmailResponse = void

export async function verifyEmail({
  code,
}: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  await api
    .post('/sessions/verify-email', {
      searchParams: {
        code,
      },
    })
    .json<VerifyEmailResponse>()
}
