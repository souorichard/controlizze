'use client'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AlertCircle, EllipsisVertical, Trash2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { getCategoriesAction } from '../actions'
import { getCategoriesFilter } from './filters/get-categories-filter'
import { typeHandler } from './functions/type-handler'
import { CategoriesTableSkeleton } from './skeletons/categories-table-skeleton'

dayjs.extend(relativeTime)

export function CategoriesTable() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const filters = getCategoriesFilter(searchParams)

  const { data, isPending } = useQuery({
    queryKey: ['categories', filters],
    queryFn: getCategoriesAction.bind(null, filters),
  })

  function handlePaginate(page: number) {
    const params = new URLSearchParams(searchParams)

    params.set('page', page.toString())

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-3">
      <div className="border-muted/50 bg-muted/20 overflow-hidden rounded-md border-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Created at</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[140px]">Color</TableHead>
              <TableHead className="w-[140px]">Type</TableHead>
              <TableHead className="w-[120px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <CategoriesTableSkeleton />}

            {data?.categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-20">
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="text-primary size-4" />
                    No categories.
                  </div>
                </TableCell>
              </TableRow>
            )}

            {data?.categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{dayjs(category.createdAt).fromNow()}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <div
                    className="h-3 w-20 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </TableCell>
                <TableCell>{typeHandler({ type: category.type })}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <Button size="icon" variant="outline">
                    <EllipsisVertical className="size-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data?.categories && (
        <Pagination
          page={Number(filters.page)}
          perPage={Number(filters.perPage)}
          total={data.totalCount}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  )
}
