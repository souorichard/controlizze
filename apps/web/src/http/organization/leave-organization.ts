import { api } from '../api-client'

type LeaveOrganizationResponse = void

export async function leaveOrganization(
  organization: string,
): Promise<LeaveOrganizationResponse> {
  const response = await api
    .delete(`organizations/${organization}/leave`)
    .json<LeaveOrganizationResponse>()

  return response
}
