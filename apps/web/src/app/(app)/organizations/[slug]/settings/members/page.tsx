import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { ability, getCurrentOrganization } from '@/auth/auth'
import { Separator } from '@/components/ui/separator'

import { InviteMemberForm } from './_components/invite-member-form'
import { MembersTable } from './_components/members-table'

export const metadata: Metadata = {
  title: 'Settings: Members',
}

export default async function MembersPage() {
  const currentOrganization = await getCurrentOrganization()
  const permissions = await ability()

  const canGetMembers = permissions?.can('get', 'User')

  if (!canGetMembers) {
    redirect(`/organizations/${currentOrganization}/settings/billing`)
  }

  return (
    <main className="space-y-8">
      <InviteMemberForm />

      <Separator />

      <MembersTable />
    </main>
  )
}
