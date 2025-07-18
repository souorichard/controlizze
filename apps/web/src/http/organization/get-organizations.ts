import { api } from '../api-client'

interface GetOrganizationResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations(): Promise<GetOrganizationResponse> {
  const response = await api
    .get('organizations')
    .json<GetOrganizationResponse>()

  return response
}
