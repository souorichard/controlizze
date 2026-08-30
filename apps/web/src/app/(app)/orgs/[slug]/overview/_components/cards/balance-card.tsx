'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, Wallet2 } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useOrg } from '@/hooks/use-org'
import { cn } from '@/lib/utils'
import { getTransactionsBalanceAmountMetricsAction } from '../../actions'
import { AmountsCardSkeleton } from '../skeletons/amounts-card-skeleton'

interface BalanceCardProps extends ComponentProps<'div'> {}

export function BalanceCard({ className, ...props }: BalanceCardProps) {
  const org = useOrg()

  const { data: balance, isLoading } = useQuery({
    queryKey: ['metrics', org, 'balance'],
    queryFn: () => getTransactionsBalanceAmountMetricsAction(),
  })

  return (
    <Card
      className={cn('gap-5 transition-all hover:-translate-y-0.5', className)}
      {...props}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm font-medium">Balance</p>
          {isLoading ? (
            <Loader2 className="text-foreground size-8 animate-spin" />
          ) : (
            <div className="size-8 flex items-center justify-center bg-foreground/10 rounded-lg">
              <Wallet2 className="text-foreground size-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {balance ? (
          <>
            <p className="text-xl font-medium tracking-wide text-foreground lg:text-3xl">
              {balance?.amount.toLocaleString('en-us', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              })}
            </p>
            <p className="text-muted-foreground text-xs">
              {balance?.diffFromLastMonth === null ? (
                <span className="text-muted-foreground tracking-wide">--%</span>
              ) : (
                <span
                  className={cn(
                    'tracking-wide',
                    balance?.diffFromLastMonth === 0
                      ? 'text-muted-foreground'
                      : balance?.diffFromLastMonth > 0
                        ? 'text-foreground'
                        : 'text-destructive',
                  )}
                >
                  {balance.diffFromLastMonth > 0
                    ? `+${balance.diffFromLastMonth}`
                    : balance.diffFromLastMonth}
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
