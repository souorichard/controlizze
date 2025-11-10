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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { getTransactionsAction } from '../actions'
import { DeleteTransactionDialog } from './dialogs/delete-transaction-dialog'
import { getTransactionsFilter } from './functions/get-transactions-filter'
import { statusHandler } from './functions/status-handler'
// import { typeHandler } from './functions/type-handler'
import { TransactionsTableSkeleton } from './skeletons/transactions-table-skeleton'
import { TransactionOptions } from './transaction-options'

dayjs.extend(relativeTime)

export function TransactionsTable({ organization }: { organization: string }) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const filters = getTransactionsFilter(searchParams)

  const { data, isPending } = useQuery({
    queryKey: ['transactions', organization, filters],
    queryFn: getTransactionsAction.bind(null, filters),
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
              <TableHead>Description</TableHead>
              {/* <TableHead className="w-[120px]">Type</TableHead> */}
              <TableHead className="w-[160px]">Category</TableHead>
              <TableHead className="w-[160px]">Status</TableHead>
              <TableHead className="w-[132px] text-right">Amount</TableHead>
              <TableHead className="w-[120px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && <TransactionsTableSkeleton />}

            {data?.transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-20">
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="text-primary size-4" />
                    No transactions.
                  </div>
                </TableCell>
              </TableRow>
            )}

            {data?.transactions.map((transaction) => {
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {dayjs(transaction.createdAt).fromNow()}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  {/* <TableCell>
                    {typeHandler({ type: transaction.type })}
                  </TableCell> */}
                  <TableCell className="max-w-[160px] truncate">
                    {transaction.category.name}
                  </TableCell>
                  <TableCell>
                    {statusHandler({ status: transaction.status })}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-medium',
                      transaction.type === 'EXPENSE'
                        ? 'text-destructive'
                        : 'text-emerald-500',
                    )}
                  >
                    {transaction.amount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <TransactionOptions
                      organization={organization}
                      transaction={transaction}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Delete transaction</span>
                        </Button>
                      </AlertDialogTrigger>

                      <DeleteTransactionDialog
                        organization={organization}
                        transactionId={transaction.id}
                      />
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} />
              <TableCell colSpan={1}>
                <div className="flex flex-col justify-center gap-4 text-sm font-semibold">
                  <span className="text-primary text-sm font-medium">
                    Subtotal{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (per page)
                    </span>
                  </span>
                  <span className="text-primary text-sm font-medium">
                    Total{' '}
                    <span className="text-muted-foreground text-xs font-normal">
                      (in general)
                    </span>
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={1}>
                <div className="flex flex-col items-end justify-center gap-4 text-sm font-semibold">
                  <span>
                    {data?.pageSubtotal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }) ?? 'R$ 0,00'}
                  </span>
                  <span>
                    {data?.totalAmount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }) ?? 'R$ 0,00'}
                  </span>
                </div>
              </TableCell>
              <TableCell colSpan={1} />
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {data && (
        <Pagination
          page={Number(filters.page)}
          perPage={Number(filters.perPage)}
          total={data?.totalCount}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  )
}
