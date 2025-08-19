'use server'

import { Role } from '@controlizze/auth'
import { HTTPError } from 'ky'

import { getCurrentOrganization } from '@/auth/auth'
import { createInvite } from '@/http/invite/create-invite'
import { getInvites } from '@/http/invite/get-invites'
import { revokeInvite } from '@/http/invite/revoke-invite'
import { getMembers } from '@/http/member/get-members'
import { updateMember } from '@/http/member/update-member'
import { transferOrganization } from '@/http/organization/transfer-organization'
import { ActionResponse } from '@/interfaces/action-response'

import { InviteMemberFormData } from './_components/invite-member-form'

export async function inviteMemberAction({
  email,
  role,
}: InviteMemberFormData): Promise<ActionResponse> {
  const currentOrganization = await getCurrentOrganization()

  try {
    await createInvite({
      organization: currentOrganization!,
      email,
      role,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Internal server error.',
    }
  }

  return {
    success: true,
    message: 'Invite sent successfully.',
  }
}

export async function getInvitesAction() {
  const currentOrganization = await getCurrentOrganization()

  const { invites } = await getInvites(currentOrganization!)

  return {
    invites,
  }
}

export async function revokeInviteAction(inviteId: string) {
  const currentOrganization = await getCurrentOrganization()

  await revokeInvite({
    organization: currentOrganization!,
    inviteId,
  })
}

export async function getMembersAction() {
  const currentOrganization = await getCurrentOrganization()

  const { members } = await getMembers(currentOrganization!)

  return {
    members,
  }
}

interface UpdateMemberActionProps {
  memberId: string
  role: Role
}

export async function updateMemberAction({
  memberId,
  role,
}: UpdateMemberActionProps): Promise<ActionResponse> {
  const currentOrganization = await getCurrentOrganization()

  try {
    await updateMember({ organization: currentOrganization!, memberId, role })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Internal server error.',
    }
  }

  return {
    success: true,
    message: 'Member role updated successfully.',
  }
}

export async function transferOrganizationAction(memberId: string) {
  const currentOrganization = await getCurrentOrganization()

  await transferOrganization({
    organization: currentOrganization!,
    memberId,
  })
}
