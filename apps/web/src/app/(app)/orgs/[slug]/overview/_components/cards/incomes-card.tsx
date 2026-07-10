'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, TrendingUp } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useOrg } from '@/hooks/use-org'
import { cn } from '@/lib/utils'
import { getTransactionsAmountMetricsAction } from '../../actions'
import { AmountsCardSkeleton } from '../skeletons/amounts-card-skeleton'

interface IncomesCardProps extends ComponentProps<'div'> {}

export function IncomesCard({ className, ...props }: IncomesCardProps) {
  const org = useOrg()

  const { data: incomes, isLoading } = useQuery({
    queryKey: ['metrics', org, 'incomes'],
    queryFn: () => getTransactionsAmountMetricsAction({ type: 'INCOME' }),
  })

  return (
    <Card
      className={cn(
        'gap-5 transition-all hover:border-primary hover:-translate-y-0.5',
        className,
      )}
      {...props}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <p className="text-muted-foreground text-sm font-medium">INCOMES</p>
          {isLoading ? (
            <Loader2 className="text-primary size-8 animate-spin" />
          ) : (
            <div className="size-8 flex items-center justify-center bg-emerald-500/10 border border-emerald-500 rounded-full">
              <TrendingUp className="text-emerald-500 size-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {incomes ? (
          <>
            <p className="text-xl font-semibold font-heading tracking-wide lg:text-3xl">
              {incomes?.amount.toLocaleString('en-us', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              })}
            </p>
            <p className="text-muted-foreground text-xs">
              {incomes?.diffFromLastMonth === null ? (
                <span className="text-muted-foreground tracking-wide">
                  --% compared to last month
                </span>
              ) : (
                <span
                  className={cn(
                    'tracking-wide',
                    incomes?.diffFromLastMonth === 0
                      ? 'text-muted-foreground'
                      : incomes?.diffFromLastMonth > 0
                        ? 'text-emerald-500'
                        : 'text-destructive',
                  )}
                >
                  {incomes.diffFromLastMonth > 0
                    ? `+${incomes.diffFromLastMonth}`
                    : incomes.diffFromLastMonth}
                  % compared to last month
                </span>
              )}
            </p>
          </>
        ) : (
          <AmountsCardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
