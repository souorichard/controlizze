import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from './ui/button'

interface PaginationProps {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  perPage,
  total,
  onPageChange,
}: PaginationProps) {
  const pages = Math.ceil(total / perPage)
  const totalPages = pages > 0 ? pages : 1

  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm">
        Total of {total} iten(s)
      </span>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center justify-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>
        <nav className="flex items-center space-x-2">
          <Button
            size="icon"
            variant="outline"
            className="hidden size-8 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={() => onPageChange(page + 1)}
            disabled={pages <= page + 1}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="hidden size-8 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={pages <= page + 1}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </nav>
      </div>
    </div>
  )
}
