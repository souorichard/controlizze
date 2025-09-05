'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

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
    color: 'var(--chart-5)',
  },
  label: {
    color: 'var(--background)',
  },
} satisfies ChartConfig

export function ExpenseCategoriesCard() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <CardTitle>Expense categories</CardTitle>
        <CardDescription>
          See categories of your expenses and their total amount.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
