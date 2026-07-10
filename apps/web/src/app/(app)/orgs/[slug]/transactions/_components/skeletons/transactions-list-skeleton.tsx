import { Skeleton } from '@/components/ui/skeleton'

export function TransactionsListSkeleton() {
  return (
    <div className="[&_div:last-child]:border-0">
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: This is a static skeleton component, so using the index as a key is acceptable here.
            key={i}
            className="group p-4 flex items-center gap-4 hover:bg-muted/20 transition-all border-b"
          >
            <Skeleton className="size-10 border-2" />

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-4">
                <Skeleton className="w-40 h-6" />

                <div className="flex items-center gap-1.5">
                  <Skeleton className="w-20 h-5" />
                  <p className="text-xs text-muted-foreground">•</p>
                  <Skeleton className="w-20 h-5" />
                  <p className="text-xs text-muted-foreground">•</p>
                  <Skeleton className="w-20 h-5" />
                </div>
              </div>

              {/* <Skeleton className="w-20 h-4" /> */}
            </div>

            <Skeleton className="w-32 h-5" />

            <div className="size-10 ml-2 opacity-0" />
          </div>
        )
      })}
    </div>
  )
}
