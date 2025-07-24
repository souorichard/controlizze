import { Role } from '@controlizze/auth'

import { api } from '../api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    userId: string
    organizationId: string
  }
}

export async function getMembership(
  organization: string,
): Promise<GetMembershipResponse> {
  const response = await api
    .get(`organization/${organization}/membership`)
    .json<GetMembershipResponse>()

  return response
}
