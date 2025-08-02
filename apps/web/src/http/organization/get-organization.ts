import { api } from '../api-client'

interface GetOrganizationResponse {
  organization: {
    id: string
    name: string
    slug: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    ownerId: string
  }
}

export async function getOrganization(
  slug: string,
): Promise<GetOrganizationResponse> {
  const response = await api
    .get(`organizations/${slug}`, {
      next: {
        tags: ['organizations'],
      },
    })
    .json<GetOrganizationResponse>()

  return response
}
