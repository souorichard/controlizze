import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function TransactionsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => {
        return (
          <TableRow key={index}>
            {Array.from({ length: 6 }).map((_, index) => {
              return (
                <TableCell key={index}>
                  <Skeleton className="h-6" />
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </>
  )
}
