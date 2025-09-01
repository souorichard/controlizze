'use client'

import { TrendingUp } from 'lucide-react'

export function RevenuesCard() {
  return (
    <div className="flex flex-col gap-4 rounded-md border px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs font-medium">REVENUES</p>
        <TrendingUp className="size-4 text-green-500" />
      </div>
      <div className="space-y-1">
        <p className="text-xl font-semibold">R$ 2.570,88</p>
        <p className="text-muted-foreground text-xs">
          <span className="text-green-500">+12.5%</span> more than last month
        </p>
      </div>
    </div>
  )
}
