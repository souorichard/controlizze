import { getCurrentOrganization } from '@/auth/auth'
import { InterceptedDialogContent } from '@/components/intercepted-dialog-content'
import { TransactionForm } from '@/components/transaction-form'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default async function CreateTransactionPage() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <Dialog defaultOpen>
      <InterceptedDialogContent>
        <DialogHeader>
          <DialogTitle>Create transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction for this organization.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm organization={currentOrganization!} />
      </InterceptedDialogContent>
    </Dialog>
  )
}
