import { getCurrentOrganization } from '@/auth/auth'
import { Separator } from '@/components/ui/separator'
import { getOrganization } from '@/http/organization/get-organization'

import { DeleteOrganizationForm } from './_components/delete-organization-form'
import { OrganizationDomainForm } from './_components/organization-domain-form'
import { OrganizationNameForm } from './_components/organization-name-form'

export default async function GeneralPage() {
  const currentOrganization = await getCurrentOrganization()

  const { organization } = await getOrganization(currentOrganization!)

  return (
    <main className="space-y-8">
      <OrganizationNameForm initialData={organization.name} />

      <Separator />

      {organization.domain && (
        <>
          <OrganizationDomainForm initialData={organization} />
          <Separator />
        </>
      )}

      <DeleteOrganizationForm organizationId={organization.id} />
    </main>
  )
}
