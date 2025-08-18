import { organizationSchema } from '@controlizze/auth'
import { Metadata } from 'next'

import { ability, getCurrentOrganization } from '@/auth/auth'
import { Separator } from '@/components/ui/separator'
import { getMembership } from '@/http/organization/get-membership'
import { getOrganization } from '@/http/organization/get-organization'

import { InviteMemberForm } from './_components/invite-member-form'
import { InvitesTable } from './_components/invites-table'
import { MembersTable } from './_components/members-table'

export const metadata: Metadata = {
  title: 'Settings: Members',
}

export default async function MembersPage() {
  const currentOrganization = await getCurrentOrganization()
  const permissions = await ability()

  const canInviteMembers = permissions?.can('create', 'Invite')

  const [{ organization }, { membership }] = await Promise.all([
    getOrganization(currentOrganization!),
    getMembership(currentOrganization!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  const serializedPermissions = {
    canUpdateMember: permissions?.can('update', 'User'),
    canTransferOwnership: permissions?.can('update', authOrganization),
    canRemoveMember: permissions?.can('delete', 'User'),
  }

  return (
    <main className="space-y-8">
      {canInviteMembers && (
        <>
          <InviteMemberForm organization={currentOrganization!} />
          <Separator />
          <InvitesTable organization={currentOrganization!} />
          <Separator />
        </>
      )}

      <MembersTable
        permissions={serializedPermissions}
        organization={organization}
        membership={membership}
      />
    </main>
  )
}
