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

import { removeMemberAction } from '../../actions'

interface RemoveMemberDialogProps {
  organization: string
  memberId: string
}

export function RemoveMemberDialog({
  organization,
  memberId,
}: RemoveMemberDialogProps) {
  const queryClient = useQueryClient()

  async function handleRemoveMember() {
    await removeMemberAction({ memberId })

    queryClient.invalidateQueries({ queryKey: ['members', organization] })
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to remove this member?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. The user will no longer be part of this
          organization .
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          type="submit"
          variant="destructive"
          onClick={handleRemoveMember}
        >
          Confirm
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
