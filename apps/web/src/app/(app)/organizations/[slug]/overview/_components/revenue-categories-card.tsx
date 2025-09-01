'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { category: 'January', amount: 186 },
  { category: 'February', amount: 305 },
  { category: 'March', amount: 237 },
  { category: 'April', amount: 73 },
  { category: 'May', amount: 209 },
  { category: 'June', amount: 214 },
]

const chartConfig = {
  amount: {
    label: 'Amount',
    color: 'var(--chart-4)',
  },
  label: {
    color: 'var(--background)',
  },
} satisfies ChartConfig

export function RevenueCategoriesCard() {
  return (
    <div className="flex flex-col gap-4 rounded-md border px-5 py-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Revenue categories</p>
        <p className="text-muted-foreground text-xs">
          See categories of your revenues and their total amount.
        </p>
      </div>

      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            right: 16,
          }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="category"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <XAxis dataKey="amount" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey="amount"
            layout="vertical"
            fill="var(--color-amount)"
            radius={4}
          >
            <LabelList
              dataKey="category"
              position="insideLeft"
              offset={8}
              className="fill-(--color-label)"
              fontSize={12}
            />
            <LabelList
              dataKey="amount"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
