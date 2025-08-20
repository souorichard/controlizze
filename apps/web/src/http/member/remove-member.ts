import { api } from '../api-client'

interface RemoveMemberRequest {
  organization: string
  memberId: string
}

type RemoveMemberResponse = void

export async function removeMember({
  organization,
  memberId,
}: RemoveMemberRequest): Promise<RemoveMemberResponse> {
  await api.delete(`organizations/${organization}/members/${memberId}`)
}
