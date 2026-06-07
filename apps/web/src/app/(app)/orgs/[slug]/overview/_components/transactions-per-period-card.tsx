'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, CircleAlert, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
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
import { getTransactionsPerPeriodMetricsAction } from '../actions'

const chartConfig = {
  transactions: {
    label: 'Transações',
  },
  expenses: {
    label: 'Despesas',
    color: 'var(--chart-1)',
  },
  incomes: {
    label: 'Receitas',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

type Month = '1' | '3' | '6' | '9' | '12'

export function TransactionsPerPeriodCard() {
  const org = useOrg()

  const [month, setMonth] = useState<Month>('1')

  const { data: transactionsPerPeriod, error } = useQuery({
    queryKey: ['metrics', org, 'transactions-per-period', month],
    queryFn: () => getTransactionsPerPeriodMetricsAction({ lastMonths: month }),
  })

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Transações por período</CardTitle>
          <CardDescription>
            Veja suas transações em cada período e tipo
          </CardDescription>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-xs">Período</span>
          <Select
            defaultValue="1"
            onValueChange={(value) => setMonth(value as Month)}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">Último mês</SelectItem>
                <SelectItem value="3">Últimos 3 meses</SelectItem>
                <SelectItem value="6">Últimos 6 meses</SelectItem>
                <SelectItem value="9">Últimos 9 meses</SelectItem>
                <SelectItem value="12">Últimos 12 meses</SelectItem>
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
                />
                <Area
                  dataKey="incomes"
                  type="monotone"
                  fill="url(#fillIncomes)"
                  strokeWidth={2}
                  stroke="var(--color-incomes)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="flex h-62.5 w-full flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <CircleAlert className="text-primary size-5" />
                <span className="text-sm">Nenhuma transação encontrada</span>
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
      <CardFooter className="justify-end gap-3 py-2.5">
        <Button size="xs" variant="link" asChild>
          <Link href={`/orgs/${org}/transactions`}>
            Ver todas as transações
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
