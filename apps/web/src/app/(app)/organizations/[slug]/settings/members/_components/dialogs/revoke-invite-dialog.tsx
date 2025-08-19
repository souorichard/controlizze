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

import { revokeInviteAction } from '../../actions'

interface RevokeInviteDialogProps {
  organization: string
  inviteId: string
}

export function RevokeInviteDialog({
  organization,
  inviteId,
}: RevokeInviteDialogProps) {
  const queryClient = useQueryClient()

  async function handleRevokeInvite() {
    await revokeInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: [`${organization}/invites`] })
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
