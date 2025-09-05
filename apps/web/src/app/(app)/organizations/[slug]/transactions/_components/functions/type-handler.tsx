import { TrendingDown, TrendingUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface TypeHandlerProps {
  type: 'EXPENSE' | 'REVENUE'
}

export function typeHandler({ type }: TypeHandlerProps) {
  switch (type) {
    case 'EXPENSE':
      return (
        <Badge>
          <TrendingDown className="text-red-500" />
          Expense
        </Badge>
      )
    case 'REVENUE':
      return (
        <Badge>
          <TrendingUp className="text-green-500" />
          Revenue
        </Badge>
      )
  }
}
