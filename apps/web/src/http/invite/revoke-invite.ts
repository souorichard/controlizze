import { api } from '../api-client'

interface RevokeInviteRequest {
  organization: string
  inviteId: string
}

export async function revokeInvite({
  organization,
  inviteId,
}: RevokeInviteRequest) {
  await api.delete(`organizations/${organization}/invites/${inviteId}`)
}
