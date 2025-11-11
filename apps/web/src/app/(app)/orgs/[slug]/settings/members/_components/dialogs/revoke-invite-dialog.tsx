'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useOrganization } from '@/hooks/use-organization'

import { revokeInviteAction } from '../../actions'

interface RevokeInviteDialogProps {
  inviteId: string
}

export function RevokeInviteDialog({ inviteId }: RevokeInviteDialogProps) {
  const queryClient = useQueryClient()

  const organization = useOrganization()

  async function handleRevokeInvite() {
    await revokeInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['invites', organization] })
    queryClient.invalidateQueries({
      queryKey: ['pending-invites'],
    })
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to revoke this invite?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. The user will no longer be able to
          accept it.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          type="submit"
          variant="destructive"
          onClick={handleRevokeInvite}
        >
          Confirm
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
