import { Skeleton } from '@/components/ui/skeleton'

export function OrgSelectorSkeleton() {
  return (
    <div className="rounded-xl border overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: This is a skeleton component, so using the index as a key is acceptable here.
          key={i}
          className="group h-15 flex items-center gap-3 px-5 bg-card/60 hover:bg-muted/40 transition-colors border-b last:border-0"
        >
          <Skeleton className="size-8 rounded-md shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
