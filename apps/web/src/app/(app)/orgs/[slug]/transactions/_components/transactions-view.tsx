'use client'

import { useQuery } from '@tanstack/react-query'
import { CircleAlert, CirclePlus } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  ContainerContentList,
  ContainerContentListWrapper,
} from '@/components/container'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { useOrg } from '@/hooks/use-org'
import { getTransactionsFilter } from '@/utils/filters'
import { getTransactionsAction } from '../actions'
import { LiveTitleFilter } from './filters/live-title-filter'
import { StatusFilter } from './filters/status-filter'
import { TypeFilter } from './filters/type-filter'
import { TransactionsListSkeleton } from './skeletons/transactions-list-skeleton'
import { TransactionsList } from './transactions-list'

export function TransactionsView() {
  const org = useOrg()
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const filters = getTransactionsFilter(searchParams)

  const { data, isPending } = useQuery({
    queryKey: ['transactions', org, filters],
    queryFn: () => getTransactionsAction(filters),
  })

  function handlePaginate(page: number) {
    const params = new URLSearchParams(searchParams)

    params.set('page', page.toString())

    replace(`${pathname}?${params.toString()}`)
  }

  const transactions = data?.transactions ?? []
  const meta = data?.meta

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <LiveTitleFilter />
        <TypeFilter />
        <StatusFilter />

        <Button className="ml-auto">
          <CirclePlus className="size-4" />
          New transaction
        </Button>
      </div>

      <ContainerContentList>
        {isPending && (
          <ContainerContentListWrapper>
            <TransactionsListSkeleton />
          </ContainerContentListWrapper>
        )}

        {!isPending && transactions.length === 0 && (
          <ContainerContentListWrapper>
            <div className="h-20 flex items-center justify-center gap-2">
              <CircleAlert className="text-primary size-5" />
              <span className="text-sm">No transactions found</span>
            </div>
          </ContainerContentListWrapper>
        )}

        {!isPending && transactions && transactions.length > 0 && meta && (
          <>
            <ContainerContentListWrapper>
              <TransactionsList transactions={transactions} />
            </ContainerContentListWrapper>
            <Pagination
              page={meta.page}
              perPage={meta.perPage}
              total={meta.total}
              onPageChange={handlePaginate}
            />
          </>
        )}
      </ContainerContentList>
    </div>
  )
}
