import { api } from '../api-client'

interface UpdateProfileNameRequest {
  name: string
}

type UpdateProfileNameResponse = void

export async function updateProfileName({
  name,
}: UpdateProfileNameRequest): Promise<UpdateProfileNameResponse> {
  const response = await api
    .patch('profile/name', {
      json: {
        name,
      },
    })
    .json<UpdateProfileNameResponse>()

  return response
}
