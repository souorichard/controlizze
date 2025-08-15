import { Metadata } from 'next'

import { ability } from '@/auth/auth'
import { Separator } from '@/components/ui/separator'

import { InviteMemberForm } from './_components/invite-member-form'
import { MembersTable } from './_components/members-table'

export const metadata: Metadata = {
  title: 'Settings: Members',
}

export default async function MembersPage() {
  const permissions = await ability()

  const canInviteMembers = permissions?.can('create', 'Invite')

  return (
    <main className="space-y-8">
      {canInviteMembers && (
        <>
          <InviteMemberForm />
          <Separator />
        </>
      )}

      <MembersTable />
    </main>
  )
}
