import type { Role } from '@controlizze/rbac'
import { api } from '../api-client'

interface GetOrgsResponse {
  orgs: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
    role: Role
  }[]
}

export async function getOrgs(): Promise<GetOrgsResponse> {
  const response = await api
    .get('/orgs', {
      next: {
        tags: ['orgs'],
      },
    })
    .json<GetOrgsResponse>()

  return response
}
