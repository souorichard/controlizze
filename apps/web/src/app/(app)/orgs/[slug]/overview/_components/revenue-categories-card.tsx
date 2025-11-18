'use client'

import { useQuery } from '@tanstack/react-query'
import { CircleAlert, Loader2, XCircle } from 'lucide-react'
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
import { useOrganization } from '@/hooks/use-organization'

import { getTopRevenueCategoriesAction } from '../actions'

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
  const organization = useOrganization()

  const { data: topRevenueCategories, error } = useQuery({
    queryKey: ['analysis', organization, 'top-revenue-categories'],
    queryFn: getTopRevenueCategoriesAction,
  })

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <CardTitle>Revenue categories</CardTitle>
        <CardDescription>
          See top four categories of your revenues and their total amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topRevenueCategories ? (
          <>
            {topRevenueCategories.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart
                  accessibilityLayer
                  data={topRevenueCategories}
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
                      formatter={(value: number) => value.toLocaleString()}
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[200px] w-full flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CircleAlert className="text-primary size-5" />
                  <span className="text-sm">No categories.</span>
                </div>
              </div>
            )}
          </>
        ) : error ? (
          <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <XCircle className="text-destructive size-5" />
              <span className="text-sm">Something went wrong.</span>
            </div>
          </div>
        ) : (
          <div className="flex h-[200px] w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Loader2 className="text-primary size-5 animate-spin" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
