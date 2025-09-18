import { api } from '../api-client'

interface UpdateOrganizationAvatarRequest {
  organization: string
  avatarUrl: string
}

type UpdateOrganizationAvatarResponse = void

export async function updateOrganizationAvatar({
  organization,
  avatarUrl,
}: UpdateOrganizationAvatarRequest): Promise<UpdateOrganizationAvatarResponse> {
  const response = await api
    .patch(`organizations/${organization}/avatar`, {
      json: {
        avatarUrl,
      },
    })
    .json<UpdateOrganizationAvatarResponse>()

  return response
}
