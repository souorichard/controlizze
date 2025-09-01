'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { DateRangePicker } from '@/components/ui/date-range-picker'

dayjs.extend(relativeTime)

const chartData = [
  { date: '2024-04-01', expense: 222, revenue: 150 },
  { date: '2024-04-02', expense: 97, revenue: 180 },
  { date: '2024-04-03', expense: 167, revenue: 120 },
  { date: '2024-04-04', expense: 242, revenue: 260 },
  { date: '2024-04-05', expense: 373, revenue: 290 },
  { date: '2024-04-06', expense: 301, revenue: 340 },
  { date: '2024-04-07', expense: 245, revenue: 180 },
  { date: '2024-04-08', expense: 409, revenue: 320 },
  { date: '2024-04-09', expense: 59, revenue: 110 },
  { date: '2024-04-10', expense: 261, revenue: 190 },
  { date: '2024-04-11', expense: 327, revenue: 350 },
  { date: '2024-04-12', expense: 292, revenue: 210 },
  { date: '2024-04-13', expense: 342, revenue: 380 },
  { date: '2024-04-14', expense: 137, revenue: 220 },
  { date: '2024-04-15', expense: 120, revenue: 170 },
  { date: '2024-04-16', expense: 138, revenue: 190 },
  { date: '2024-04-17', expense: 446, revenue: 360 },
  { date: '2024-04-18', expense: 364, revenue: 410 },
  { date: '2024-04-19', expense: 243, revenue: 180 },
  { date: '2024-04-20', expense: 89, revenue: 150 },
  { date: '2024-04-21', expense: 137, revenue: 200 },
  { date: '2024-04-22', expense: 224, revenue: 170 },
  { date: '2024-04-23', expense: 138, revenue: 230 },
  { date: '2024-04-24', expense: 387, revenue: 290 },
  { date: '2024-04-25', expense: 215, revenue: 250 },
  { date: '2024-04-26', expense: 75, revenue: 130 },
  { date: '2024-04-27', expense: 383, revenue: 420 },
  { date: '2024-04-28', expense: 122, revenue: 180 },
  { date: '2024-04-29', expense: 315, revenue: 240 },
  { date: '2024-04-30', expense: 454, revenue: 380 },
  { date: '2024-05-01', expense: 165, revenue: 220 },
  { date: '2024-05-02', expense: 293, revenue: 310 },
  { date: '2024-05-03', expense: 247, revenue: 190 },
  { date: '2024-05-04', expense: 385, revenue: 420 },
  { date: '2024-05-05', expense: 481, revenue: 390 },
  { date: '2024-05-06', expense: 498, revenue: 520 },
  { date: '2024-05-07', expense: 388, revenue: 300 },
  { date: '2024-05-08', expense: 149, revenue: 210 },
  { date: '2024-05-09', expense: 227, revenue: 180 },
  { date: '2024-05-10', expense: 293, revenue: 330 },
  { date: '2024-05-11', expense: 335, revenue: 270 },
  { date: '2024-05-12', expense: 197, revenue: 240 },
  { date: '2024-05-13', expense: 197, revenue: 160 },
  { date: '2024-05-14', expense: 448, revenue: 490 },
  { date: '2024-05-15', expense: 473, revenue: 380 },
  { date: '2024-05-16', expense: 338, revenue: 400 },
  { date: '2024-05-17', expense: 499, revenue: 420 },
  { date: '2024-05-18', expense: 315, revenue: 350 },
  { date: '2024-05-19', expense: 235, revenue: 180 },
  { date: '2024-05-20', expense: 177, revenue: 230 },
  { date: '2024-05-21', expense: 82, revenue: 140 },
  { date: '2024-05-22', expense: 81, revenue: 120 },
  { date: '2024-05-23', expense: 252, revenue: 290 },
  { date: '2024-05-24', expense: 294, revenue: 220 },
  { date: '2024-05-25', expense: 201, revenue: 250 },
  { date: '2024-05-26', expense: 213, revenue: 170 },
  { date: '2024-05-27', expense: 420, revenue: 460 },
  { date: '2024-05-28', expense: 233, revenue: 190 },
  { date: '2024-05-29', expense: 78, revenue: 130 },
  { date: '2024-05-30', expense: 340, revenue: 280 },
  { date: '2024-05-31', expense: 178, revenue: 230 },
  { date: '2024-06-01', expense: 178, revenue: 200 },
  { date: '2024-06-02', expense: 470, revenue: 410 },
  { date: '2024-06-03', expense: 103, revenue: 160 },
  { date: '2024-06-04', expense: 439, revenue: 380 },
  { date: '2024-06-05', expense: 88, revenue: 140 },
  { date: '2024-06-06', expense: 294, revenue: 250 },
  { date: '2024-06-07', expense: 323, revenue: 370 },
  { date: '2024-06-08', expense: 385, revenue: 320 },
  { date: '2024-06-09', expense: 438, revenue: 480 },
  { date: '2024-06-10', expense: 155, revenue: 200 },
  { date: '2024-06-11', expense: 92, revenue: 150 },
  { date: '2024-06-12', expense: 492, revenue: 420 },
  { date: '2024-06-13', expense: 81, revenue: 130 },
  { date: '2024-06-14', expense: 426, revenue: 380 },
  { date: '2024-06-15', expense: 307, revenue: 350 },
  { date: '2024-06-16', expense: 371, revenue: 310 },
  { date: '2024-06-17', expense: 475, revenue: 520 },
  { date: '2024-06-18', expense: 107, revenue: 170 },
  { date: '2024-06-19', expense: 341, revenue: 290 },
  { date: '2024-06-20', expense: 408, revenue: 450 },
  { date: '2024-06-21', expense: 169, revenue: 210 },
  { date: '2024-06-22', expense: 317, revenue: 270 },
  { date: '2024-06-23', expense: 480, revenue: 530 },
  { date: '2024-06-24', expense: 132, revenue: 180 },
  { date: '2024-06-25', expense: 141, revenue: 190 },
  { date: '2024-06-26', expense: 434, revenue: 380 },
  { date: '2024-06-27', expense: 448, revenue: 490 },
  { date: '2024-06-28', expense: 149, revenue: 200 },
  { date: '2024-06-29', expense: 103, revenue: 160 },
  { date: '2024-06-30', expense: 446, revenue: 400 },
]

const chartConfig = {
  visitors: {
    label: 'Transactions',
  },
  expense: {
    label: 'Expense',
    color: 'var(--chart-1)',
  },
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function TransactionPerPeriodCard() {
  const [period, setPeriod] = useState<DateRange | undefined>({
    from: dayjs().subtract(7, 'days').toDate(),
    to: new Date(),
  })

  return (
    <div className="flex flex-col gap-4 rounded-md border px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Transactions per period</p>
          <p className="text-muted-foreground text-xs">
            See your transactions per period for each type.
          </p>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-xs">Period</span>
          <DateRangePicker date={period} onDateChange={setPeriod} />
        </div>
      </div>

      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-expense)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-expense)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-revenue)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-revenue)"
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
              />
            }
          />
          <Area
            dataKey="expense"
            type="natural"
            fill="url(#fillRevenue)"
            stroke="var(--color-revenue)"
            stackId="a"
          />
          <Area
            dataKey="revenue"
            type="natural"
            fill="url(#fillExpense)"
            stroke="var(--color-expense)"
            stackId="a"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
