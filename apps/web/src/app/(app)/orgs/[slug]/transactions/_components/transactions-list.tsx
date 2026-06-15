'use client'

import { TrendingDown } from 'lucide-react'

export function TransactionsList() {
  return (
    <div className="[&_div:last-child]:border-0">
      <div className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-all border-b">
        <div className="size-10 flex items-center justify-center bg-destructive/10 border border-destructive rounded-full">
          <TrendingDown className="text-destructive size-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Aluguel</h3>
            Category
          </div>
          <p className="text-xs text-muted-foreground">há 3 horas</p>
        </div>
      </div>
    </div>
  )
}
