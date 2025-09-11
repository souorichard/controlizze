import { api } from '../api-client'

interface UpdateProfileEmailRequest {
  email: string
}

type UpdateProfileEmailResponse = void

export async function updateProfileEmail({
  email,
}: UpdateProfileEmailRequest): Promise<UpdateProfileEmailResponse> {
  const response = await api
    .patch('profile/email', {
      json: {
        email,
      },
    })
    .json<UpdateProfileEmailResponse>()

  return response
}
