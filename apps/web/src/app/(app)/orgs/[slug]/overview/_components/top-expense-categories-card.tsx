'use client'

import { useQuery } from '@tanstack/react-query'
import { CircleAlert, Loader2, XCircle } from 'lucide-react'
import { useMemo } from 'react'
import { Pie, PieChart } from 'recharts'

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { useOrg } from '@/hooks/use-org'
import { getTopExpenseCategoriesMetricsAction } from '../actions'

export function TopExpenseCategoriesCard() {
  const org = useOrg()

  const { data: topExpenseCategories, error } = useQuery({
    queryKey: ['metrics', org, 'top-expense-categories'],
    queryFn: () => getTopExpenseCategoriesMetricsAction(),
  })

  const chartData = useMemo(() => {
    if (!topExpenseCategories) return []

    return topExpenseCategories.map((category, index) => ({
      ...category,
      fill: `var(--chart-${(index % 5) + 1})`,
    }))
  }, [topExpenseCategories])

  const chartConfig = useMemo(() => {
    if (!topExpenseCategories) {
      return {
        categories: {
          label: 'Categorias',
        },
      } satisfies ChartConfig
    }

    return topExpenseCategories.reduce(
      (acc, category, index) => {
        acc[category.category] = {
          label: category.category,
          color: `var(--chart-${(index % 5) + 1})`,
        }

        return acc
      },
      {
        categories: {
          label: 'Categorias',
        },
      } as ChartConfig,
    )
  }, [topExpenseCategories])

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Despesas por categoria</CardTitle>
        <CardDescription>
          Olhe onde seu dinheiro está sendo utilizado com mais frequência
        </CardDescription>
      </CardHeader>

      <CardContent>
        {topExpenseCategories ? (
          topExpenseCategories.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-62.5 w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent className="w-50" />}
                />

                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={50}
                />

                <ChartLegend
                  content={<ChartLegendContent />}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-62.5 w-full flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <CircleAlert className="text-primary size-5" />
                <span className="text-sm">Nenhuma categoria encontrada</span>
              </div>
            </div>
          )
        ) : error ? (
          <div className="flex h-62.5 w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <XCircle className="text-destructive size-8" />
              <span className="text-sm">
                Ocorreu um erro ao carregar os dados
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-62.5 w-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Loader2 className="text-primary size-8 animate-spin" />
              <span className="sr-only">Carregando...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
