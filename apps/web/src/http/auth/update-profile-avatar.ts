import { api } from '../api-client'

interface UpdateProfileAvatarRequest {
  avatarUrl: string
}

type UpdateProfileAvatarResponse = void

export async function updateProfileAvatar({
  avatarUrl,
}: UpdateProfileAvatarRequest): Promise<UpdateProfileAvatarResponse> {
  const response = await api
    .patch('profile/avatar', {
      json: {
        avatarUrl,
      },
    })
    .json<UpdateProfileAvatarResponse>()

  return response
}
