'use client'

import { Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Transaction } from '@/interfaces/transaction-interface'
import { dayjs } from '@/lib/dayjs'
import { cn } from '@/lib/utils'
import { statusHandler } from './status-handler'

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
            className="group p-4 flex items-center gap-4 hover:bg-muted/20 transition-all border-b"
          >
            {isExpense ? (
              <div className="size-10 flex items-center justify-center bg-destructive/10 border border-destructive rounded-full">
                <TrendingDown className="text-destructive size-5" />
              </div>
            ) : (
              <div className="size-10 flex items-center justify-center bg-emerald-500/10 border border-emerald-500 rounded-full">
                <TrendingUp className="text-emerald-500 size-5" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{transaction.title}</h3>

                <div className="flex items-center gap-1">
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
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {dayjs(transaction.transactionDate).fromNow()}
              </p>
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
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
