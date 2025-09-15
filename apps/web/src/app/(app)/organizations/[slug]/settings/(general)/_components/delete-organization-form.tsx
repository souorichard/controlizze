import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { DeleteOrganizationDialog } from './dialogs/delete-organization-dialog'

export function DeleteOrganizationForm() {
  return (
    <div className="grid grid-rows-[auto_auto] items-center gap-6 lg:grid-cols-2 lg:grid-rows-none lg:gap-10">
      <div className="space-y-2">
        <Badge variant="destructive" className="text-[10px] uppercase">
          Danger zone
        </Badge>
        <h2 className="font-semibold">Delete organization</h2>
        <p className="text-muted-foreground text-sm">
          All of the organization data will be{' '}
          <b className="text-foreground font-medium">permanently deleted</b>{' '}
          (this action is not reversible, so please continue with caution).
        </p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="submit"
            variant="destructive"
            className="w-full lg:w-fit"
          >
            Delete organization
          </Button>
        </AlertDialogTrigger>

        <DeleteOrganizationDialog />
      </AlertDialog>
    </div>
  )
}
