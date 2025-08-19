import { api } from '../api-client'

interface TransferOrganizationRequest {
  organization: string
  memberId: string
}

type TransferOrganizationResponse = void

export async function transferOrganization({
  organization,
  memberId,
}: TransferOrganizationRequest): Promise<TransferOrganizationResponse> {
  const response = await api
    .patch(`organizations/${organization}/owner`, {
      json: {
        transferToUserId: memberId,
      },
    })
    .json<TransferOrganizationResponse>()

  return response
}
