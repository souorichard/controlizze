import { InterceptedDialogContent } from '@/components/intercepted-dialog-content'
import { OrganizationForm } from '@/components/organization-form'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function CreateOrganizationPage() {
  return (
    <Dialog defaultOpen>
      <InterceptedDialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Create and share with your team members.
          </DialogDescription>
        </DialogHeader>
        <OrganizationForm />
      </InterceptedDialogContent>
    </Dialog>
  )
}
