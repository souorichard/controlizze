'use client'

import { useQuery } from '@tanstack/react-query'
import { CircleAlert, Loader2, XCircle } from 'lucide-react'
import { type ComponentProps, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOrg } from '@/hooks/use-org'
import { dayjs } from '@/lib/dayjs'
import { formatDateWithMonth } from '@/utils/format-date'
import { getBalanceEvolutionMetricsAction } from '../../actions'

const chartConfig = {
  evolutions: {
    label: 'Evolução',
  },
  balance: {
    label: 'Saldo',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

interface BalanceEvolutionCardProps extends ComponentProps<'div'> {}

export function BalanceEvolutionCard({ ...props }: BalanceEvolutionCardProps) {
  const org = useOrg()

  const currentYear = dayjs().year()
  const years = [currentYear, currentYear - 1, currentYear - 2]
  const [year, setYear] = useState<string>(currentYear.toString())

  const { data: evolutions, error } = useQuery({
    queryKey: ['metrics', org, 'balance-evolution', year],
    queryFn: () => getBalanceEvolutionMetricsAction({ year }),
  })

  return (
    <Card {...props}>
      <CardHeader className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Evolução do saldo</CardTitle>
          <CardDescription>
            Veja a evolução do seu saldo ao longo do ano selecionado
          </CardDescription>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-xs">Ano</span>
          <Select defaultValue={year} onValueChange={(value) => setYear(value)}>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Selecionar ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {evolutions ? (
          evolutions.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-62.5 w-full"
            >
              <BarChart
                accessibilityLayer
                data={evolutions}
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
                  tickFormatter={(value) => formatDateWithMonth(value)}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => formatDateWithMonth(value)}
                      className="w-40"
                    />
                  }
                />
                <Bar
                  dataKey="balance"
                  type="monotone"
                  fill="var(--color-balance)"
                  radius={8}
                  isAnimationActive
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-62.5 w-full flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <CircleAlert className="text-primary size-5" />
                <span className="text-sm">Nenhuma evolução encontrada</span>
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
