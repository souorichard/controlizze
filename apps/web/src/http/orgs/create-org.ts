import { api } from '../api-client'

interface CreateOrgRequest {
  name: string
  description?: string
  // avatarUrl: string | null
}

type CreateOrgResponse = void

export async function createOrg({
  name,
  description,
  // avatarUrl,
}: CreateOrgRequest): Promise<CreateOrgResponse> {
  const response = await api
    .post('/orgs', {
      json: {
        name,
        description,
        // avatarUrl,
      },
      next: {
        tags: ['orgs'],
      },
    })
    .json<CreateOrgResponse>()

  return response
}
