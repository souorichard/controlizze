import { Role } from '@controlizze/auth'

import { api } from '../api-client'

interface GetPendingInvitesResponse {
  invites: {
    id: string
    role: Role
    email: string
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
    organization: {
      name: string
    }
  }[]
}

export async function getPendingInvites(): Promise<GetPendingInvitesResponse> {
  const response = await api
    .get('pending-invites')
    .json<GetPendingInvitesResponse>()

  return response
}
