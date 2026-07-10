'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from '@/lib/react-query'

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryClientProvider>
  )
}
