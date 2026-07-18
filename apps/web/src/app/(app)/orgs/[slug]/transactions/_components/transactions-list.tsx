'use client'

import { CornerDownRight, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Transaction } from '@/interfaces/transaction'
import { dayjs } from '@/lib/dayjs'
import { cn } from '@/lib/utils'
import { getInitials } from '@/utils/get-initials'
import { statusHandler } from './helpers/status-handler'

interface TransactionsListProps {
  transactions: Transaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <div className="[&_div:last-child]:border-0">
      {transactions.map((transaction) => {
        const isExpense = transaction.type === 'expense'

        return (
          <div
            key={transaction.id}
            className="group p-4 flex items-center gap-4 hover:bg-muted/20 transition-all border-b cursor-pointer"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  className={cn(
                    'size-10 border-2 rounded-full',
                    isExpense ? 'border-destructive' : 'border-emerald-500',
                  )}
                >
                  {transaction.owner.avatarUrl ? (
                    <>
                      <AvatarImage
                        src={transaction.owner.avatarUrl as string}
                      />
                      <AvatarFallback>
                        {getInitials(transaction.owner.name as string)}
                      </AvatarFallback>
                    </>
                  ) : null}
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="flex-col items-start">
                <div className="space-y-0.5">
                  <p className="text-muted-foreground">Account</p>
                  <p>{transaction.owner.name}</p>
                </div>

                <div className="flex gap-6">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Created at</p>
                    <p>{dayjs(transaction.createdAt).format('DD/MM/YYYY')}</p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-muted-foreground">Occurred at</p>
                    <p>
                      {dayjs(transaction.transactionDate).format('DD/MM/YYYY')}
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>

            <div className="flex-1">
              <h3 className="font-medium">{transaction.title}</h3>
              {transaction.description && (
                <div className="flex items-start gap-1 text-muted-foreground">
                  <CornerDownRight className="size-3" />
                  <p className="max-w-full text-xs truncate">
                    {transaction.description}
                  </p>
                </div>
              )}
            </div>

            <div className="min-w-60 flex items-center gap-2">
              <div
                style={{ backgroundColor: transaction.category.color }}
                className="size-2 rounded-full"
              />
              <p className="text-sm">{transaction.category.name}</p>
            </div>

            <div className="min-w-20">
              {statusHandler({ status: transaction.status })}
            </div>

            <div className="min-w-40 text-end">
              <p
                className={cn(
                  'font-semibold tracking-wide',
                  isExpense ? 'text-destructive' : 'text-emerald-500',
                )}
              >
                {isExpense ? '-' : '+'}
                {transaction.amount.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="ml-2 opacity-0 group-hover:opacity-100"
              asChild
            >
              <Link href="/create-transaction">
                <Trash2 className="size-4" />
                <span className="sr-only">Delete transaction</span>
              </Link>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
