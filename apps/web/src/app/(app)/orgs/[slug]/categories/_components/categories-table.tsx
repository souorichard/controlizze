'use client'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AlertCircle, Trash2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Pagination } from '@/components/pagination'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useOrganization } from '@/hooks/use-organization'

import { getCategoriesAction } from '../actions'
import { CategoryOptions } from './category-options'
import { DeleteCategoryDialog } from './dialogs/delete-category-dialog'
import { getCategoriesFilter } from './filters/get-categories-filter'
import { typeHandler } from './functions/type-handler'
import { CategoriesTableSkeleton } from './skeletons/categories-table-skeleton'

dayjs.extend(relativeTime)

export function CategoriesTable() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const organization = useOrganization()

  const filters = getCategoriesFilter(searchParams)

  const { data, isPending } = useQuery({
    queryKey: ['categories', organization, filters],
    queryFn: getCategoriesAction.bind(null, filters),
  })

  function handlePaginate(page: number) {
    const params = new URLSearchParams(searchParams)

    params.set('page', page.toString())

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-3">
      <div className="border-muted/50 bg-card overflow-hidden rounded-md border-4">
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
                <TableCell>
                  {dayjs(category.createdAt).format('MMM DD, YYYY').toString()}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <div
                    className="h-3 w-20 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </TableCell>
                <TableCell>{typeHandler({ type: category.type })}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <CategoryOptions category={category} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete category</span>
                      </Button>
                    </AlertDialogTrigger>

                    <DeleteCategoryDialog categoryId={category.id} />
                  </AlertDialog>
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
