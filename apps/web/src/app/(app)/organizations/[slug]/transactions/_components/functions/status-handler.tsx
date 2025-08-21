import { CircleDot } from 'lucide-react'

interface StatusHandlerProps {
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
}

export function statusHandler({ status }: StatusHandlerProps) {
  switch (status) {
    case 'PENDING':
      return (
        <span className="flex items-center gap-2">
          <CircleDot className="size-3 text-blue-400" />
          Pending
        </span>
      )
    case 'COMPLETED':
      return (
        <span className="flex items-center gap-2">
          <CircleDot className="size-3 text-green-500" />
          Completed
        </span>
      )
    case 'CANCELLED':
      return (
        <span className="flex items-center gap-2">
          <CircleDot className="size-3 text-red-500" />
          Cancelled
        </span>
      )
    default:
      return (
        <span className="flex items-center gap-2">
          <CircleDot className="size-3 text-zinc-500" />
          Unknown status
        </span>
      )
  }
}
