'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, Wallet2 } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useOrg } from '@/hooks/use-org'
import { cn } from '@/lib/utils'
import { getTransactionsBalanceAmountMetricsAction } from '../actions'
import { AmountsCardSkeleton } from './skeletons/amounts-card-skeleton'

export function BalanceCard() {
  const org = useOrg()

  const { data: balance, isLoading } = useQuery({
    queryKey: ['metrics', org, 'balance'],
    queryFn: () => getTransactionsBalanceAmountMetricsAction(),
  })

  return (
    <Card className="gap-5">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <p className="text-muted-foreground text-sm font-medium">
            SALDO DO MÊS
          </p>
          {isLoading ? (
            <Loader2 className="text-primary size-8 animate-spin" />
          ) : (
            <div className="size-8 flex items-center justify-center bg-orange-500/10 border border-orange-500 rounded-full">
              <Wallet2 className="text-orange-500 size-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {balance ? (
          <>
            <p className="text-xl font-semibold font-heading tracking-wide lg:text-3xl">
              {balance?.amount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              })}
            </p>
            <p className="text-muted-foreground text-xs">
              {balance?.diffFromLastMonth === null ? (
                <span className="text-muted-foreground tracking-wide">
                  --% comparado ao mês anterior
                </span>
              ) : (
                <span
                  className={cn(
                    'tracking-wide',
                    balance?.diffFromLastMonth === 0
                      ? 'text-muted-foreground'
                      : balance?.diffFromLastMonth < 0
                        ? 'text-emerald-500'
                        : 'text-destructive',
                  )}
                >
                  {balance.diffFromLastMonth > 0
                    ? `+${balance.diffFromLastMonth}`
                    : balance.diffFromLastMonth}
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
