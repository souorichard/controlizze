'use client'

import { Wallet2 } from 'lucide-react'

export function BalanceCard() {
  return (
    <div className="flex flex-col gap-4 rounded-md border px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs font-medium">BALANCE</p>
        <Wallet2 className="size-4 text-orange-500" />
      </div>
      <div className="space-y-1">
        <p className="text-xl font-semibold">R$ 7.210,24</p>
        <p className="text-muted-foreground text-xs">
          <span className="text-green-500">+12.5%</span> more than last month
        </p>
      </div>
    </div>
  )
}
