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

import { transferOrganizationAction } from '../../actions'

interface TransferOrganizationDialogProps {
  memberId: string
}

export function TransferOrganizationDialog({
  memberId,
}: TransferOrganizationDialogProps) {
  const queryClient = useQueryClient()

  const organization = useOrganization()

  async function handleTransferOrganization() {
    await transferOrganizationAction({ transferToUserId: memberId })

    queryClient.invalidateQueries({ queryKey: ['members', organization] })
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to transfer ownership?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. The user will become the new owner of
          the organization.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button variant="secondary" onClick={handleTransferOrganization}>
          Confirm
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
