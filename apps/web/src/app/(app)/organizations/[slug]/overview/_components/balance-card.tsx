'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, Wallet2 } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { getTotalBalanceAmountAction } from '../actions'
import { AmountsCardSkeleton } from './skeletons/amounts-card-skeleton'

export function BalanceCard({ organization }: { organization: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analysis', organization, 'balance'],
    queryFn: getTotalBalanceAmountAction,
  })

  return (
    <Card className="gap-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm font-medium">BALANCE</p>
          {isLoading ? (
            <Loader2 className="text-primary size-5 animate-spin" />
          ) : (
            <Wallet2 className="size-5 text-orange-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {data ? (
          <>
            <p className="text-xl font-semibold lg:text-2xl">
              {data?.amount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
              })}
            </p>
            <p className="text-muted-foreground text-xs">
              <span
                className={cn(
                  '',
                  data?.diffFromLastMonth === 0
                    ? 'text-foreground'
                    : data?.diffFromLastMonth > 0
                      ? 'text-green-500'
                      : 'text-destructive',
                )}
              >
                {data.diffFromLastMonth > 0
                  ? `+${data.diffFromLastMonth}`
                  : data.diffFromLastMonth}
                %
              </span>{' '}
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
