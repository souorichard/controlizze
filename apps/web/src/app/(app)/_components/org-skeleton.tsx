import { Skeleton } from '@/components/ui/skeleton'

export function OrgSelectorSkeleton() {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: This is a skeleton component, so using the index as a key is acceptable here.
          key={i}
          className="flex items-center gap-3 px-4 py-3.5 bg-muted/20 border-b border-border last:border-0"
        >
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
