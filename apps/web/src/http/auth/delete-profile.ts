import { api } from '../api-client'

type UpdateProfileNameResponse = void

export async function deleteProfile(): Promise<UpdateProfileNameResponse> {
  const response = await api.delete('profile').json<UpdateProfileNameResponse>()

  return response
}
