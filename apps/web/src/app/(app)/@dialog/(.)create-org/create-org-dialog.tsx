import { OrgForm } from '@/components/forms/org-form'
import { InterceptedDialogContent } from '@/components/intercepted-dialog-content'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function CreateOrgDialog() {
  return (
    <Dialog open>
      <InterceptedDialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Let's get your organization set up. It only takes a minute
          </DialogDescription>
        </DialogHeader>

        <OrgForm viewMode="dialog" />
      </InterceptedDialogContent>
    </Dialog>
  )
}
