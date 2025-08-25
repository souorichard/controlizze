'use client'

import { TransactionForm } from '@/components/transaction-form'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Transaction } from '@/interfaces/transaction'

interface UpdateTransactionDialogProps {
  organization: string
  transactionId: string
  initialData: Transaction
}

export function UpdateTransactionDialog({
  organization,
  transactionId,
  initialData,
}: UpdateTransactionDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update transaction</DialogTitle>
        <DialogDescription>
          Update and share with your organization members.
        </DialogDescription>
      </DialogHeader>

      <TransactionForm
        organization={organization}
        transactionId={transactionId}
        initialData={initialData}
        isUpdating
      />
    </DialogContent>
  )
}
