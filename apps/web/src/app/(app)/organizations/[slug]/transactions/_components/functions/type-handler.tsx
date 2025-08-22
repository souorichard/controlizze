import { TrendingDown, TrendingUp } from 'lucide-react'

interface TypeHandlerProps {
  type: 'EXPENSE' | 'REVENUE'
}

export function typeHandler({ type }: TypeHandlerProps) {
  switch (type) {
    case 'EXPENSE':
      return (
        <span className="flex items-center gap-2">
          <TrendingDown className="size-4 rounded-full text-red-600" />
          Expense
        </span>
      )
    case 'REVENUE':
      return (
        <span className="flex items-center gap-2">
          <TrendingUp className="size-4 rounded-full text-green-600" />
          Revenue
        </span>
      )
  }
}
