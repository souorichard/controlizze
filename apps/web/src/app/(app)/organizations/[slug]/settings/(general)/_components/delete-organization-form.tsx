'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface DeleteOrganizationFormProps {
  organizationId: string
}

export function DeleteOrganizationForm({
  organizationId,
}: DeleteOrganizationFormProps) {
  async function handleDeleteOrganization() {
    console.log('delete organization:', organizationId)
  }

  return (
    <div className="grid grid-cols-2 items-center gap-10">
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

      <form onSubmit={handleDeleteOrganization}>
        <Button type="submit" variant="destructive">
          Delete organization
        </Button>
      </form>
    </div>
  )
}
