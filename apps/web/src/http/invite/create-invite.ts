import { Role } from '@controlizze/auth'

import { api } from '../api-client'

interface CreateInviteRequest {
  organization: string
  email: string
  role: Role
}

type CreateInviteResponse = void

export async function createInvite({
  organization,
  email,
  role,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  await api.post(`organizations/${organization}/invites`, {
    json: {
      email,
      role,
    },
  })
}
