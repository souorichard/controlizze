// import { ability } from '@/auth/auth'
import { Button } from '@/components/ui/button'

export async function LeaveOrganizationForm() {
  // const permissions = await ability()

  const canLeaveOrganization = true

  return (
    <div className="grid grid-cols-2 items-center gap-10">
      <div className="space-y-2">
        <h2 className="font-semibold">Leave organization</h2>
        <p className="text-muted-foreground text-sm">
          Revoke your access to this organization. The organization data won't
          be deleted.
        </p>
      </div>

      <form>
        <Button
          type="submit"
          variant="secondary"
          disabled={canLeaveOrganization}
        >
          Leave organization
        </Button>
      </form>
    </div>
  )
}
