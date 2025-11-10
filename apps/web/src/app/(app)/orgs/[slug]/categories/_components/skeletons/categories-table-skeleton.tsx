import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function CategoriesTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => {
        return (
          <TableRow key={index}>
            {Array.from({ length: 5 }).map((_, index) => {
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
