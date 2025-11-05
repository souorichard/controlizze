'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Trash2 } from 'lucide-react'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { getInvitesAction } from '../actions'
import { RevokeInviteDialog } from './dialogs/revoke-invite-dialog'
import { InvitesTableSkeleton } from './skeletons/invites-table-skeleton'

export function InvitesTable({ organization }: { organization: string }) {
  const { data, isPending } = useQuery({
    queryKey: ['invites', organization],
    queryFn: getInvitesAction,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="font-semibold">Invites</h2>
        <p className="text-muted-foreground text-sm">
          Manage all invites that you have sent.
        </p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>E-mail</TableHead>
              <TableHead className="lg:w-[200px]">Role</TableHead>
              <TableHead className="text-center lg:w-[140px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <InvitesTableSkeleton />}

            {data?.invites.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-20">
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="text-primary size-4" />
                    No invites.
                  </div>
                </TableCell>
              </TableRow>
            )}

            {data?.invites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell>{invite.email}</TableCell>
                <TableCell>{invite.role}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Revoke invite</span>
                        </Button>
                      </AlertDialogTrigger>

                      <RevokeInviteDialog
                        organization={organization}
                        inviteId={invite.id}
                      />
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
