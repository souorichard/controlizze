'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, CircleAlert, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { type ComponentProps, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOrg } from '@/hooks/use-org'
import { formatDate } from '@/utils/format-date'
import { getTransactionsPerPeriodMetricsAction } from '../../actions'

const chartConfig = {
  transactions: {
    label: 'Transactions',
  },
  expenses: {
    label: 'Expenses',
    color: 'var(--chart-1)',
  },
  incomes: {
    label: 'Incomes',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

type DayPeriod = '90' | '30' | '7'

interface TransactionsPerPeriodCardProps extends ComponentProps<'div'> {}

export function TransactionsPerPeriodCard({
  ...props
}: TransactionsPerPeriodCardProps) {
  const org = useOrg()

  const [period, setPeriod] = useState<DayPeriod>('90')

  const { data: transactionsPerPeriod, error } = useQuery({
    queryKey: ['metrics', org, 'transactions-per-period', period],
    queryFn: () => getTransactionsPerPeriodMetricsAction({ period }),
  })

  return (
    <Card {...props}>
      <CardHeader className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Transactions per Period</CardTitle>
          <CardDescription>
            See your transactions for each period and type
          </CardDescription>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-xs">Period</span>
          <Select
            defaultValue="90"
            onValueChange={(value) => setPeriod(value as DayPeriod)}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {transactionsPerPeriod ? (
          transactionsPerPeriod.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-62.5 w-full"
            >
              <AreaChart data={transactionsPerPeriod}>
                <defs>
                  <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-expenses)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-expenses)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillIncomes" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-incomes)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-incomes)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => formatDate(value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => formatDate(value)}
                      indicator="dot"
                      className="w-40"
                    />
                  }
                />
                <Area
                  dataKey="expenses"
                  type="monotone"
                  fill="url(#fillExpenses)"
                  strokeWidth={2}
                  stroke="var(--color-expenses)"
                  stackId="a"
                  isAnimationActive
                />
                <Area
                  dataKey="incomes"
                  type="monotone"
                  fill="url(#fillIncomes)"
                  strokeWidth={2}
                  stroke="var(--color-incomes)"
                  stackId="a"
                  isAnimationActive
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="flex h-62.5 w-full flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <CircleAlert className="text-primary size-5" />
                <span className="text-sm">No transactions found</span>
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
      <CardFooter className="justify-end gap-3 py-2.5">
        <Button size="xs" variant="link" asChild>
          <Link href={`/orgs/${org}/transactions`}>
            View all transactions
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
