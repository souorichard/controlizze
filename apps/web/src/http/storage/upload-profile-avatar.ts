import { api } from '../api-client'

interface UploadProfileAvatarRequest {
  file: File
}

interface UploadProfileAvatarResponse {
  url: string
}

export async function uploadProfileAvatar({
  file,
}: UploadProfileAvatarRequest): Promise<UploadProfileAvatarResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api
    .post('profile/upload-avatar', {
      body: formData,
    })
    .json<UploadProfileAvatarResponse>()

  return response
}
