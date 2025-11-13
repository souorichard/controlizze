'use client'

import { useQuery } from '@tanstack/react-query'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getInitials } from '@/utils/get-initials'

import { getOrganizationsAction } from '../actions'
import { OrganiztionsTableSkeleton } from './skeletons/organizations-table-skeleton'

export default function OrganizationsTable() {
  const { data, isPending } = useQuery({
    queryKey: ['organizations'],
    queryFn: getOrganizationsAction,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="font-semibold">Organizations</h2>
        <p className="text-muted-foreground text-sm">
          Manage all organization that you are a member of.
        </p>
      </div>
      <div className="border-muted/50 bg-card overflow-hidden rounded-md border-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead className="w-[200px]">Role</TableHead>
              {/* <TableHead className="w-[140px] text-center" /> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <OrganiztionsTableSkeleton />}

            {data?.organizations.map((organization) => {
              return (
                <TableRow key={organization.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        {organization.avatarUrl && (
                          <AvatarImage
                            src={organization.avatarUrl}
                            alt="Organization avatar"
                          />
                        )}
                        <AvatarFallback>
                          {getInitials(organization.name ?? 'Undefined')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{organization.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{organization.role}</span>
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            disabled={!canLeave}
                          >
                            <Undo2 className="size-4" />
                            <span className="sr-only">Leave organization</span>
                          </Button>
                        </AlertDialogTrigger>

                        <LeaveOrganizationDialog />
                      </AlertDialog>
                    </div>
                  </TableCell> */}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
