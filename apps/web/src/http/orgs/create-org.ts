import { api } from '../api-client'

interface CreateOrgRequest {
  name: string
  avatarUrl: string | null
}

type CreateOrgResponse = void

export async function createOrg({
  name,
  avatarUrl,
}: CreateOrgRequest): Promise<CreateOrgResponse> {
  const response = await api
    .post('/orgs', {
      json: {
        name,
        avatarUrl,
      },
      next: {
        tags: ['orgs'],
      },
    })
    .json<CreateOrgResponse>()

  return response
}
