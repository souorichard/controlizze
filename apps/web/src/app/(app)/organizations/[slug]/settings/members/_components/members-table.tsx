import { Pencil, Trash2 } from 'lucide-react'

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

import { RoleSelect } from './role-select'

export function MembersTable() {
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
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Member avatar"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span>Shadcn</span>
                    <span className="text-muted-foreground text-xs">
                      shadcn@acme.com
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleSelect defaultValue="MEMBER" className="w-[160px]" />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button size="icon" variant="outline">
                    <Pencil className="size-4" />
                    <span className="sr-only">Edit member</span>
                  </Button>
                  <Button size="icon" variant="destructive">
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remove member</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
