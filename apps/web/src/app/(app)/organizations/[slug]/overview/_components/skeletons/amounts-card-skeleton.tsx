import { Skeleton } from '@/components/ui/skeleton'

export function AmountsCardSkeleton() {
  return (
    <>
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mt-1 h-4 w-52" />
    </>
  )
}
