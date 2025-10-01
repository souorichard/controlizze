import { Role } from '@controlizze/auth'

import { api } from '../api-client'

interface GetInviteResponse {
  invite: {
    id: string
    email: string
    role: Role
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
    createdAt: string
    organization: {
      name: string
    }
  }
}

export async function getInvite(inviteId: string) {
  const response = await api
    .get(`invites/${inviteId}`, {
      next: {
        tags: [`/invite/${inviteId}`],
      },
    })
    .json<GetInviteResponse>()

  return response
}
