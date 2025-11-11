'use client'

import { Role } from '@controlizze/auth'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeftRight, Crown, Trash2 } from 'lucide-react'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getInitials } from '@/utils/get-initials'

import { getMembersAction } from '../actions'
import { RemoveMemberDialog } from './dialogs/remove-member-dialog'
import { TransferOrganizationDialog } from './dialogs/transfer-organization-dialog'
import { MembersTableSkeleton } from './skeletons/members-table-skeleton'
import { UpdateMemberRoleSelect } from './update-member-role-select'

interface MembersTableProps {
  permissions: {
    canUpdateMember: boolean | undefined
    canTransferOwnership: boolean | undefined
    canRemoveMember: boolean | undefined
  }
  organization: {
    id: string
    name: string
    slug: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    ownerId: string
  }
  membership: {
    id: string
    role: Role
    userId: string
    organizationId: string
  }
}

export function MembersTable({
  permissions,
  organization,
  membership,
}: MembersTableProps) {
  const { canUpdateMember, canTransferOwnership, canRemoveMember } = permissions

  const { data, isPending } = useQuery({
    queryKey: ['members', organization.slug],
    queryFn: getMembersAction,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="font-semibold">Members</h2>
        <p className="text-muted-foreground text-sm">
          Manage all members of your organization.
        </p>
      </div>
      <div className="border-muted/50 bg-muted/20 overflow-hidden rounded-md border-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="w-[200px]">Role</TableHead>
              <TableHead className="w-[140px] text-center" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <MembersTableSkeleton />}

            {data?.members.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        {member.avatarUrl && (
                          <AvatarImage
                            src={member.avatarUrl}
                            alt="Member avatar"
                          />
                        )}
                        <AvatarFallback>
                          {getInitials(member.name ?? 'Undefined')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="inline-flex items-center gap-2">
                          {member.name ?? 'Undefined'}
                          {membership.userId === member.userId && ' (me)'}
                          {organization.ownerId === member.userId && (
                            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                              <Crown className="size-4" />
                              Owner
                            </span>
                          )}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <UpdateMemberRoleSelect
                      organization={organization.slug}
                      memberId={member.id}
                      value={member.role}
                      disabled={
                        member.userId === membership.userId ||
                        member.userId === organization.ownerId ||
                        !canUpdateMember
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {canTransferOwnership && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              disabled={member.userId === organization.ownerId}
                            >
                              <ArrowLeftRight className="size-4" />
                              <span className="sr-only">
                                Transfer ownership
                              </span>
                            </Button>
                          </AlertDialogTrigger>

                          <TransferOrganizationDialog
                            memberId={member.userId}
                          />
                        </AlertDialog>
                      )}
                      {canRemoveMember && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              disabled={
                                member.userId === membership.userId ||
                                member.userId === organization.ownerId
                              }
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">Remove member</span>
                            </Button>
                          </AlertDialogTrigger>

                          <RemoveMemberDialog memberId={member.id} />
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
