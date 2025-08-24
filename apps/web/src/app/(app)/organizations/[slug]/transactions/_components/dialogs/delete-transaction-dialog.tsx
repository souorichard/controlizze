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

import { deleteTransactionAction } from '../../actions'

interface DeleteTransactionDialogProps {
  organization: string
  transactionId: string
}

export function DeleteTransactionDialog({
  organization,
  transactionId,
}: DeleteTransactionDialogProps) {
  const queryClient = useQueryClient()

  async function handleDeleteTransaction() {
    await deleteTransactionAction({ transactionId })

    queryClient.invalidateQueries({ queryKey: ['transactions', organization] })
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete this transaction?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          transaction from our organization.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          type="submit"
          variant="destructive"
          onClick={handleDeleteTransaction}
        >
          Confirm
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
