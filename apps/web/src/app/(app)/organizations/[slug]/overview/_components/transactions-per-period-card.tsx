'use client'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ArrowUpRight, CircleAlert, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
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
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Separator } from '@/components/ui/separator'

import { getTransactionsPerPeriodAction } from '../actions'

dayjs.extend(relativeTime)

const chartConfig = {
  transactions: {
    label: 'Transactions',
  },
  expenses: {
    label: 'Expenses',
    color: 'var(--chart-1)',
  },
  revenues: {
    label: 'Revenues',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function TransactionPerPeriodCard({
  organization,
}: {
  organization: string
}) {
  const [period, setPeriod] = useState<DateRange | undefined>({
    from: dayjs().subtract(14, 'days').toDate(),
    to: dayjs().toDate(),
  })

  const { data: dailyTransactionsPerPeriod, error } = useQuery({
    queryKey: ['analysis', organization, period],
    queryFn: getTransactionsPerPeriodAction.bind(null, {
      from: period?.from?.toISOString(),
      to: period?.to?.toISOString(),
    }),
  })

  function handleResetPeriod() {
    setPeriod({
      from: dayjs().subtract(14, 'days').toDate(),
      to: dayjs().toDate(),
    })
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Transactions per period</CardTitle>
          <CardDescription>
            See your transactions per period for each type.
          </CardDescription>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-xs">Period</span>
          <DateRangePicker date={period} onDateChange={setPeriod} />
        </div>
      </CardHeader>
      <CardContent>
        {dailyTransactionsPerPeriod ? (
          <>
            {dailyTransactionsPerPeriod.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart data={dailyTransactionsPerPeriod}>
                  <defs>
                    <linearGradient
                      id="fillExpenses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
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
                    <linearGradient
                      id="fillRevenues"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-revenues)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-revenues)"
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
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          const date = dayjs(value).format('MMM DD')

                          return date
                        }}
                        indicator="dot"
                        className="w-40"
                      />
                    }
                  />
                  <Area
                    dataKey="expenses"
                    type="natural"
                    fill="url(#fillExpenses)"
                    stroke="var(--color-expenses)"
                    stackId="a"
                  />
                  <Area
                    dataKey="revenues"
                    type="natural"
                    fill="url(#fillRevenues)"
                    stroke="var(--color-revenues)"
                    stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CircleAlert className="text-primary size-5" />
                  <span className="text-sm">No transactions.</span>
                </div>
                <Separator className="!w-[60px]" />
                <Button size="xs" variant="link" onClick={handleResetPeriod}>
                  Show results from the last 7 days
                </Button>
              </div>
            )}
          </>
        ) : error ? (
          <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <XCircle className="text-destructive size-5" />
              <span className="text-sm">Something went wrong.</span>
            </div>
            <Separator className="!w-[60px]" />
            <Button size="xs" variant="link" onClick={handleResetPeriod}>
              Show results from the last 7 days
            </Button>
          </div>
        ) : (
          <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Loader2 className="text-primary size-5 animate-spin" />
              {/* <span className="text-sm">Loading...</span> */}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end gap-3 py-2.5">
        <Button size="xs" variant="link" asChild>
          <Link href={`/organizations/${organization}/transactions`}>
            View all transactions
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
