import { Role } from '@controlizze/auth'

import { api } from '../api-client'

interface GetMembersResponse {
  members: {
    id: string
    userId: string
    role: Role
    name: string | null
    email: string
    avatarUrl: string | null
  }[]
}

export async function getMembers(organization: string) {
  const response = await api
    .get(`organizations/${organization}/members`, {
      next: {
        tags: [`${organization}/members`],
      },
    })
    .json<GetMembersResponse>()

  return response
}
