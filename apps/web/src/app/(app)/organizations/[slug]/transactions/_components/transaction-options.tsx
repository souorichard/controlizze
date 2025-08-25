'use client'

import { Copy, EllipsisVertical, SquarePen } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Transaction } from '@/interfaces/transaction'
import { getInitials } from '@/utils/get-initials'

import { UpdateTransactionDialog } from './dialogs/update-transaction-dialog'

interface TransactionOptionsProps {
  organization: string
  transaction: Transaction
}

export function TransactionOptions({
  organization,
  transaction,
}: TransactionOptionsProps) {
  function handleCopyTransactionId() {
    navigator.clipboard.writeText(transaction.id)
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <EllipsisVertical className="size-4" />
            <span className="sr-only">Options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Created by</DropdownMenuLabel>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="size-6">
              {transaction.owner.avatarUrl && (
                <AvatarImage
                  src={transaction.owner.avatarUrl as string}
                  alt="Owner avatar"
                />
              )}
              <AvatarFallback>
                {getInitials(transaction.owner.name ?? 'Unknown')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">
              {transaction.owner.name}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyTransactionId}>
            <Copy className="size-4" />
            Transaction ID
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <SquarePen className="size-4" />
              View details
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateTransactionDialog
        organization={organization}
        transactionId={transaction.id}
        initialData={transaction}
      />
    </Dialog>
  )
}
