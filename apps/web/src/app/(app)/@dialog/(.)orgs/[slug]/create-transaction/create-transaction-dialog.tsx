'use client'

import { useState } from 'react'

import { InterceptedDialogContent } from '@/components/intercepted-dialog-content'
import { TransactionForm } from '@/components/transaction-form'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function CreateTransactionDialog({
  organization,
}: {
  organization: string
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <InterceptedDialogContent>
        <DialogHeader>
          <DialogTitle>Create transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction for this organization.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm organization={organization} dialogState={setIsOpen} />
      </InterceptedDialogContent>
    </Dialog>
  )
}
