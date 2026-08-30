'use client'

import { useQuery } from '@tanstack/react-query'
import { CircleAlert, Loader2, XCircle } from 'lucide-react'
import type { ComponentProps } from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useOrg } from '@/hooks/use-org'
import { cn } from '@/lib/utils'
import { formatDateWithMonth } from '@/utils/format-date'
import { getMonthlyExpensesMetricsAction } from '../../actions'

const chartConfig = {
  expenses: {
    label: 'Expenses',
  },
  amount: {
    label: 'Expenses',
    color: 'var(--danger)',
  },
} satisfies ChartConfig

interface MonthlyExpensesCardProps extends ComponentProps<'div'> {}

export function MonthlyExpensesCard({
  className,
  ...props
}: MonthlyExpensesCardProps) {
  const org = useOrg()

  const { data: monthlyExpenses, error } = useQuery({
    queryKey: ['metrics', org, 'monthly-expenses'],
    queryFn: () => getMonthlyExpensesMetricsAction(),
  })

  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle>Monthly expenses</CardTitle>
        <CardDescription>
          Track how your expenses have varied over the past 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {monthlyExpenses ? (
          monthlyExpenses.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-62.5 w-full"
            >
              <LineChart
                accessibilityLayer
                data={monthlyExpenses}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) =>
                    formatDateWithMonth({ date: value, short: true })
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        formatDateWithMonth({ date: value })
                      }
                      className="w-40"
                    />
                  }
                />
                <Line
                  dataKey="amount"
                  type="monotone"
                  strokeWidth={2}
                  stroke="var(--color-amount)"
                  dot={false}
                  isAnimationActive
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex h-62.5 w-full flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <CircleAlert className="text-primary size-5" />
                <span className="text-sm">No expenses found</span>
              </div>
            </div>
          )
        ) : error ? (
          <div className="flex h-62.5 w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <XCircle className="text-destructive size-8" />
              <span className="text-sm">
                An error occurred while loading the data
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-62.5 w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Loader2 className="text-primary size-8 animate-spin" />
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
