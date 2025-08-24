import { api } from '../api-client'

interface TransferOrganizationRequest {
  organization: string
  transferToUserId: string
}

type TransferOrganizationResponse = void

export async function transferOrganization({
  organization,
  transferToUserId,
}: TransferOrganizationRequest): Promise<TransferOrganizationResponse> {
  const response = await api
    .patch(`organizations/${organization}/owner`, {
      json: {
        transferToUserId,
      },
    })
    .json<TransferOrganizationResponse>()

  return response
}
