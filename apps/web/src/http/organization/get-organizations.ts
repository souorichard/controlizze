import { api } from '../api-client'

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    plan: 'FREE' | 'PRO'
    avatarUrl: string | null
    role: 'ADMIN' | 'MEMBER' | 'BILLING'
  }[]
}

export async function getOrganizations(): Promise<GetOrganizationsResponse> {
  const response = await api
    .get('organizations', {
      next: {
        tags: ['organizations'],
      },
    })
    .json<GetOrganizationsResponse>()

  return response
}
