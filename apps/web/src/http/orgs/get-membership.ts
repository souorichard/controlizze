import type { Role } from '@controlizze/rbac'

import { api } from '../api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    userId: string
    orgId: string
  }
}

export async function getMembership(
  organization: string,
): Promise<GetMembershipResponse> {
  const response = await api
    .get(`orgs/${organization}/membership`)
    .json<GetMembershipResponse>()

  return response
}
