'use client'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CircleAlert, Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOrganization } from '@/hooks/use-organization'

import { getBalanceEvolutionAction } from '../actions'

dayjs.extend(relativeTime)

const chartConfig = {
  evolutions: {
    label: 'Evolutions',
  },
  balance: {
    label: 'Balance',
    color: 'var(--chart-6)',
  },
} satisfies ChartConfig

export function BalanceEvolutionCard() {
  const currentYear = dayjs().year().toString()

  const [year, setYear] = useState<string>(currentYear)

  const organization = useOrganization()

  const { data: evolutions, error } = useQuery({
    queryKey: ['analysis', organization, 'balance-evolution', year],
    queryFn: getBalanceEvolutionAction.bind(null, { year }),
  })

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Balance evolution</CardTitle>
          <CardDescription>
            See your balance evolution for a given year
          </CardDescription>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-xs">Year</span>
          <Select defaultValue="2025" onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {evolutions ? (
          <>
            {evolutions.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart data={evolutions}>
                  <defs>
                    <linearGradient
                      id="fillBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-balance)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-balance)"
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
                      const date = dayjs(value).format('MMM')

                      return date
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          const date = dayjs(value).format('MMMM')

                          return date
                        }}
                        indicator="dot"
                        className="w-40"
                      />
                    }
                  />
                  <Area
                    dataKey="balance"
                    type="natural"
                    fill="url(#fillBalance)"
                    stroke="var(--color-balance)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CircleAlert className="text-primary size-5" />
                  <span className="text-sm">No evolutions</span>
                </div>
              </div>
            )}
          </>
        ) : error ? (
          <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <XCircle className="text-destructive size-5" />
              <span className="text-sm">Something went wrong</span>
            </div>
          </div>
        ) : (
          <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Loader2 className="text-primary size-5 animate-spin" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
