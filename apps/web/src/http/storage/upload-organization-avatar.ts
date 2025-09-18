import { api } from '../api-client'

interface UploadOrganizationAvatarRequest {
  organization: string
  file: File
}

interface UploadOrganizationAvatarResponse {
  url: string
}

export async function uploadOrganizationAvatar({
  organization,
  file,
}: UploadOrganizationAvatarRequest): Promise<UploadOrganizationAvatarResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api
    .post(`organizations/${organization}/upload-avatar`, {
      body: formData,
    })
    .json<UploadOrganizationAvatarResponse>()

  return response
}
