import { api } from '../api-client'

interface UpdateOrganizationDomainRequest {
  organization: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type UpdateOrganizationDomainResponse = void

export async function updateOrganizationDomain({
  organization,
  domain,
  shouldAttachUsersByDomain,
}: UpdateOrganizationDomainRequest): Promise<UpdateOrganizationDomainResponse> {
  const response = await api
    .patch(`organizations/${organization}/domain`, {
      json: {
        domain,
        shouldAttachUsersByDomain,
      },
    })
    .json<UpdateOrganizationDomainResponse>()

  return response
}
