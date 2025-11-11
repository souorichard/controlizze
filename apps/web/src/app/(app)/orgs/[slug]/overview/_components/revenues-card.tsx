'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useOrganization } from '@/hooks/use-organization'
import { cn } from '@/lib/utils'

import { getRevenuesAmountAction } from '../actions'
import { AmountsCardSkeleton } from './skeletons/amounts-card-skeleton'

export function RevenuesCard() {
  const organization = useOrganization()

  const { data, isLoading } = useQuery({
    queryKey: ['analysis', organization, 'revenues'],
    queryFn: getRevenuesAmountAction,
  })

  return (
    <Card className="gap-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm font-medium">REVENUES</p>
          {isLoading ? (
            <Loader2 className="text-primary size-5 animate-spin" />
          ) : (
            <TrendingUp className="size-5 text-emerald-500" />
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
                  'tracking-wide',
                  data?.diffFromLastMonth === 0
                    ? 'text-foreground'
                    : data?.diffFromLastMonth > 0
                      ? 'text-emerald-500'
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
