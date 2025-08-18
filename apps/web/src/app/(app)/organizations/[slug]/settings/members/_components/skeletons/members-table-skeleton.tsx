import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function MembersTableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => {
        return (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-7" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-7" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-7" />
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
