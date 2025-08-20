import { Metadata } from 'next'

import { ability, getCurrentOrganization } from '@/auth/auth'
import { Separator } from '@/components/ui/separator'
import { getOrganization } from '@/http/organization/get-organization'

import { DeleteOrganizationForm } from './_components/delete-organization-form'
import { LeaveOrganizationForm } from './_components/leave-organization-form'
import { OrganizationDomainForm } from './_components/organization-domain-form'
import { OrganizationNameForm } from './_components/organization-name-form'

export const metadata: Metadata = {
  title: 'Settings: General',
}

export default async function GeneralPage() {
  const currentOrganization = await getCurrentOrganization()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canDeleteOrganization = permissions?.can('delete', 'Organization')

  const { organization } = await getOrganization(currentOrganization!)

  return (
    <main className="w-full space-y-8">
      {canUpdateOrganization && (
        <>
          <OrganizationNameForm initialData={organization.name} />
          <Separator />
        </>
      )}

      {canUpdateOrganization && (
        <>
          <OrganizationDomainForm initialData={organization} />
          <Separator />
        </>
      )}

      <LeaveOrganizationForm />

      {canDeleteOrganization && (
        <>
          <Separator />
          <DeleteOrganizationForm />
        </>
      )}
    </main>
  )
}
