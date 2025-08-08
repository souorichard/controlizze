import { Metadata } from 'next'

import { Separator } from '@/components/ui/separator'

import { InviteMemberForm } from './_components/invite-member-form'
import { MembersTable } from './_components/members-table'

export const metadata: Metadata = {
  title: 'Settings: Members',
}

export default function MembersPage() {
  return (
    <main className="space-y-8">
      <InviteMemberForm />

      <Separator />

      <MembersTable />
    </main>
  )
}
