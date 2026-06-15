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
      className={cn(
        'gap-5 transition-all hover:border-primary hover:-translate-y-0.5',
        className,
      )}
      {...props}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <p className="text-muted-foreground text-sm font-medium">DESPESAS</p>
          {isLoading ? (
            <Loader2 className="text-primary size-8 animate-spin" />
          ) : (
            <div className="size-8 flex items-center justify-center bg-destructive/10 border border-destructive rounded-full">
              <TrendingDown className="text-destructive size-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {expenses ? (
          <>
            <p className="text-xl font-semibold font-heading tracking-wide lg:text-3xl">
              {expenses?.amount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              })}
            </p>
            <p className="text-muted-foreground text-xs">
              {expenses?.diffFromLastMonth === null ? (
                <span className="text-muted-foreground tracking-wide">
                  --% comparado ao mês anterior
                </span>
              ) : (
                <span
                  className={cn(
                    'tracking-wide',
                    expenses?.diffFromLastMonth === 0
                      ? 'text-muted-foreground'
                      : expenses?.diffFromLastMonth < 0
                        ? 'text-emerald-500'
                        : 'text-destructive',
                  )}
                >
                  {expenses.diffFromLastMonth > 0
                    ? `+${expenses.diffFromLastMonth}`
                    : expenses.diffFromLastMonth}
                  % comparado ao mês anterior
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
