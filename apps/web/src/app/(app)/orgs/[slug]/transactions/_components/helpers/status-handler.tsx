import { CircleCheck, CircleX, Loader } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface StatusHandlerProps {
  status: 'PENDING' | 'PAID' | 'CANCELED'
}

export function statusHandler({ status }: StatusHandlerProps) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge variant="outline" className="gap-1.5">
          <Loader className="text-foreground" />
          Pending
        </Badge>
      )
    case 'PAID':
      return (
        <Badge variant="outline" className="gap-1.5 ">
          <CircleCheck className="text-emerald-500" />
          Paid
        </Badge>
      )
    case 'CANCELED':
      return (
        <Badge variant="outline" className="gap-1.5">
          <CircleX className="text-destructive" />
          Canceled
        </Badge>
      )
  }
}
