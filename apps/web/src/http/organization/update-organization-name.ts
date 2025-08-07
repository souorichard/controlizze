import { api } from '../api-client'

interface UpdateOrganizationNameRequest {
  organization: string
  name: string
}

type UpdateOrganizationNameResponse = void

export async function updateOrganizationName({
  organization,
  name,
}: UpdateOrganizationNameRequest): Promise<UpdateOrganizationNameResponse> {
  const response = await api
    .patch(`organizations/${organization}/name`, {
      json: {
        name,
      },
    })
    .json<UpdateOrganizationNameResponse>()

  return response
}
