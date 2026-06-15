'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2, PiggyBank } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useOrg } from '@/hooks/use-org'
import { cn } from '@/lib/utils'
import { getSavingRateMetricsAction } from '../../actions'
import { AmountsCardSkeleton } from '../skeletons/amounts-card-skeleton'

interface SavingsRateCardProps extends ComponentProps<'div'> {}

export function SavingsRateCard({ className, ...props }: SavingsRateCardProps) {
  const org = useOrg()

  const { data: savings, isLoading } = useQuery({
    queryKey: ['metrics', org, 'savings'],
    queryFn: () => getSavingRateMetricsAction(),
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
          <p className="text-muted-foreground text-sm font-medium">
            TAXA DE POUPANÇA
          </p>
          {isLoading ? (
            <Loader2 className="text-primary size-8 animate-spin" />
          ) : (
            <div className="size-8 flex items-center justify-center bg-orange-500/10 border border-orange-500 rounded-full">
              <PiggyBank className="text-orange-500 size-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {savings ? (
          <>
            <p className="text-xl font-semibold font-heading tracking-wide lg:text-3xl">
              {savings.rate}%
            </p>
            <p className="text-muted-foreground text-xs">
              {savings.transactionsCount === 0
                ? 'Nenhuma trasação no mês'
                : savings.transactionsCount === 1
                  ? `${savings.transactionsCount} transação no mês`
                  : `${savings.transactionsCount} transações no mês`}
            </p>
          </>
        ) : (
          <AmountsCardSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
