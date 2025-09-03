'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, TrendingUp } from 'lucide-react'

import { cn } from '@/lib/utils'

import { getRevenuesAmountAction } from '../actions'
import { AmountsCardSkeleton } from './skeletons/amounts-card-skeleton'

export function RevenuesCard({ organization }: { organization: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analysis', organization, 'revenues'],
    queryFn: getRevenuesAmountAction,
  })

  return (
    <div className="flex flex-col gap-4 rounded-md border px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs font-medium">REVENUES</p>
        {isLoading ? (
          <Loader2 className="text-primary size-4 animate-spin" />
        ) : (
          <TrendingUp className="size-4 text-green-500" />
        )}
      </div>
      <div className="space-y-1">
        {data ? (
          <>
            <p className="text-xl font-semibold">
              {data?.amount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
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
              more than last month
            </p>
          </>
        ) : (
          <AmountsCardSkeleton />
        )}
      </div>
    </div>
  )
}
