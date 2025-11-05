import { Check, Loader, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface StatusHandlerProps {
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
}

export function statusHandler({ status }: StatusHandlerProps) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge>
          <Loader />
          Pending
        </Badge>
      )
    case 'COMPLETED':
      return (
        <Badge>
          <Check className="text-green-500" />
          Completed
        </Badge>
      )
    case 'CANCELLED':
      return (
        <Badge>
          <X className="text-red-500" />
          Cancelled
        </Badge>
      )
  }
}
