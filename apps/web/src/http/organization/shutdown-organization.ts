import { api } from '../api-client'

interface DeleteOrganizationRequest {
  organization: string
}

type DeleteOrganizationResponse = void

export async function deleteOrganization({
  organization,
}: DeleteOrganizationRequest): Promise<DeleteOrganizationResponse> {
  const response = await api
    .delete(`organizations/${organization}`)
    .json<DeleteOrganizationResponse>()

  return response
}
