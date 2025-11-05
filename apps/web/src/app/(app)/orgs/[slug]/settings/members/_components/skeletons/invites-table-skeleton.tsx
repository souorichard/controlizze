import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function InvitesTableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => {
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
          </TableRow>
        )
      })}
    </>
  )
}
