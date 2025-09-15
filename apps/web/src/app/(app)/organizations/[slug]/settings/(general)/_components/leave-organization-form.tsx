import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { LeaveOrganizationDialog } from './dialogs/leave-organization-dialog'

export function LeaveOrganizationForm({ canLeave }: { canLeave: boolean }) {
  return (
    <div className="grid grid-rows-[auto_auto] items-center gap-6 lg:grid-cols-2 lg:grid-rows-none lg:gap-10">
      <div className="space-y-2">
        <h2 className="font-semibold">Leave organization</h2>
        <p className="text-muted-foreground text-sm">
          Revoke your access to this organization. The organization data won't
          be deleted.
        </p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-full lg:w-fit"
            disabled={!canLeave}
          >
            Leave organization
          </Button>
        </AlertDialogTrigger>

        <LeaveOrganizationDialog />
      </AlertDialog>
    </div>
  )
}
