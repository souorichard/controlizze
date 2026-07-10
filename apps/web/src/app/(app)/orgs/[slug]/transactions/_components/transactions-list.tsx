'use client'

import { CornerDownRight, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Transaction } from '@/interfaces/transaction-interface'
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
        const isExpense = transaction.type === 'EXPENSE'

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
              <TooltipContent>
                <p>{transaction.owner.name}</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{transaction.title}</h3>

                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="text-[10px] gap-1.5 text-muted-foreground uppercase"
                  >
                    <div
                      style={{ backgroundColor: transaction.category.color }}
                      className="size-1 rounded-full"
                    />
                    {transaction.category.name}
                  </Badge>

                  <p className="text-xs text-muted-foreground">•</p>

                  {statusHandler({ status: transaction.status })}

                  <p className="text-xs text-muted-foreground">•</p>

                  <p className="text-xs text-muted-foreground">
                    {dayjs(transaction.transactionDate).fromNow()}
                  </p>
                </div>
              </div>
              {transaction.description && (
                <div className="flex items-start gap-1 text-muted-foreground">
                  <CornerDownRight className="size-3" />
                  <p className="max-w-20 text-xs truncate">
                    {transaction.description}
                  </p>
                </div>
              )}
            </div>

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
