import { organizationSchema } from '@controlizze/auth'
import { ArrowLeftRight, Crown, Trash2 } from 'lucide-react'

import { ability, getCurrentOrganization } from '@/auth/auth'
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
import { getMembers } from '@/http/member/get-members'
import { getMembership } from '@/http/organization/get-membership'
import { getOrganization } from '@/http/organization/get-organization'
import { getInitials } from '@/utils/get-initials'

import { RoleSelect } from './role-select'

export async function MembersTable() {
  const currentOrganiation = await getCurrentOrganization()
  const permissions = await ability()

  const [{ organization }, { membership }, { members }] = await Promise.all([
    getOrganization(currentOrganiation!),
    getMembership(currentOrganiation!),
    getMembers(currentOrganiation!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  const canUpdateMember = permissions?.can('update', 'User')
  const canTransferOwnership = permissions?.can('update', authOrganization)
  const canRemoveMember = permissions?.can('delete', 'User')

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="font-semibold">Members</h2>
        <p className="text-muted-foreground text-sm">
          Manage all members of your organization.
        </p>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="w-[200px]">Role</TableHead>
              <TableHead className="w-[140px] text-center" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
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
                    <RoleSelect
                      value={member.role}
                      className="w-[160px]"
                      disabled={
                        member.userId === membership.userId ||
                        member.userId === organization.ownerId ||
                        !canUpdateMember
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {canTransferOwnership && (
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={member.userId === organization.ownerId}
                        >
                          <ArrowLeftRight className="size-4" />
                          <span className="sr-only">Transfer ownership</span>
                        </Button>
                      )}
                      {canRemoveMember && (
                        <Button
                          size="icon"
                          variant="destructive"
                          disabled={
                            member.userId === membership.userId ||
                            member.userId === organization.ownerId
                          }
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Remove member</span>
                        </Button>
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
