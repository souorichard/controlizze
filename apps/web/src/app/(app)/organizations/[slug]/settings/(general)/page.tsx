import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { ability, getCurrentOrganization } from '@/auth/auth'
import { Separator } from '@/components/ui/separator'
import { getOrganization } from '@/http/organization/get-organization'

import { DeleteOrganizationForm } from './_components/delete-organization-form'
import { OrganizationDomainForm } from './_components/organization-domain-form'
import { OrganizationNameForm } from './_components/organization-name-form'

export const metadata: Metadata = {
  title: 'Settings: General',
}

export default async function GeneralPage() {
  const currentOrganization = await getCurrentOrganization()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')

  const { organization } = await getOrganization(currentOrganization!)

  if (!canUpdateOrganization) {
    redirect(`/organizations/${currentOrganization}/settings/members`)
  }

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

      <DeleteOrganizationForm />
    </main>
  )
}
