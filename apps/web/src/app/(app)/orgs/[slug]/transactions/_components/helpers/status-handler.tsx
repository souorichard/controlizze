import { Check, Loader, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface StatusHandlerProps {
  status: 'PENDING' | 'PAID' | 'CANCELED'
}

export function statusHandler({ status }: StatusHandlerProps) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge
          variant="outline"
          className="text-[10px] gap-1.5 text-muted-foreground uppercase"
        >
          <Loader className="text-foreground" />
          Pending
        </Badge>
      )
    case 'PAID':
      return (
        <Badge
          variant="outline"
          className="text-[10px] gap-1.5 text-muted-foreground uppercase"
        >
          <Check className=" text-emerald-500" />
          Paid
        </Badge>
      )
    case 'CANCELED':
      return (
        <Badge
          variant="outline"
          className="text-[10px] gap-1.5 text-muted-foreground uppercase"
        >
          <X className="text-destructive" />
          Canceled
        </Badge>
      )
  }
}
