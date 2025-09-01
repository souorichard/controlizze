'use server'

import { acceptInvite } from '@/http/invite/accept-invite'
import { rejectInvite } from '@/http/invite/reject-invite'

export async function acceptInviteAction(inviteId: string) {
  await acceptInvite(inviteId)
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
}
