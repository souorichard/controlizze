import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function TransactionsTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => {
        return (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5" />
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
