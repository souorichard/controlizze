import { InterceptedDialogContent } from '@/components/intercepted-dialog-content'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { OrganizationForm } from '../../organizations/_components/organization-form'

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
