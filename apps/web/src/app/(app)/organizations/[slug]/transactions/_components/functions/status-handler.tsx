import { Badge } from '@/components/ui/badge'

interface StatusHandlerProps {
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
}

export function statusHandler({ status }: StatusHandlerProps) {
  switch (status) {
    case 'PENDING':
      return (
        // <span className="flex items-center gap-2">
        //   <CircleDot className="size-3 rounded-full bg-blue-400" />
        //   Pending
        // </span>
        <Badge className="bg-blue-900 tracking-wide text-blue-200">
          Pending
        </Badge>
      )
    case 'COMPLETED':
      return (
        // <span className="flex items-center gap-2">
        //   <div className="size-3 rounded-full bg-green-500" />
        //   Completed
        // </span>
        <Badge className="bg-green-800 tracking-wide text-green-200">
          Completed
        </Badge>
      )
    case 'CANCELLED':
      return (
        // <span className="flex items-center gap-2">
        //   <div className="size-3 rounded-full bg-red-500" />
        //   Cancelled
        // </span>
        <Badge className="bg-red-900 tracking-wide text-red-200">
          Cancelled
        </Badge>
      )
  }
}
