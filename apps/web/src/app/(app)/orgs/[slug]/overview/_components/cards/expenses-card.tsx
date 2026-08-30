'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, TrendingDown } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useOrg } from '@/hooks/use-org'
import { cn } from '@/lib/utils'
import { getTransactionsAmountMetricsAction } from '../../actions'
import { AmountsCardSkeleton } from '../skeletons/amounts-card-skeleton'

interface ExpensesCardProps extends ComponentProps<'div'> {}

export function ExpensesCard({ className, ...props }: ExpensesCardProps) {
  const org = useOrg()

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['metrics', org, 'expenses'],
    queryFn: () => getTransactionsAmountMetricsAction({ type: 'EXPENSE' }),
  })

  return (
    <Card
      className={cn('gap-5 transition-all hover:-translate-y-0.5', className)}
      {...props}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm font-medium">
            Total expense
          </p>
          {isLoading ? (
            <Loader2 className="text-primary size-8 animate-spin" />
          ) : (
            <div className="size-8 flex items-center justify-center bg-danger/10 rounded-lg">
              <TrendingDown className="size-4 text-danger" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {expenses ? (
          <>
            <p className="text-xl font-medium tracking-wide text-danger lg:text-3xl">
              {expenses?.amount.toLocaleString('en-us', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              })}
            </p>
            <p className="text-muted-foreground text-xs">
              {expenses?.diffFromLastMonth === null ? (
                <span className="text-muted-foreground tracking-wide">--%</span>
              ) : (
                <span
                  className={cn(
                    'tracking-wide',
                    expenses?.diffFromLastMonth === 0
                      ? 'text-muted-foreground'
                      : expenses?.diffFromLastMonth < 0
                        ? 'text-emerald-500'
                        : 'text-danger',
                  )}
                >
                  {expenses.diffFromLastMonth > 0
                    ? `+${expenses.diffFromLastMonth}`
                    : expenses.diffFromLastMonth}
                  %
                </span>
              )}{' '}
              compared to last month
            </p>
          </>
        ) : (
          <AmountsCardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
