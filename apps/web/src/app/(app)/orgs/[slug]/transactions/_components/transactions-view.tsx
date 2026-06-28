'use client'

import { useQuery } from '@tanstack/react-query'
import { CirclePlus } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  ContainerContentTable,
  ContainerContentTableWrapper,
} from '@/components/container'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useOrg } from '@/hooks/use-org'
import { getTransactionsFilter } from '@/utils/filters'
import { getTransactionsAction } from '../actions'
import { TransactionsList } from './transactions-list'

export function TransactionsView() {
  const org = useOrg()
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const filters = getTransactionsFilter(searchParams)

  const { data } = useQuery({
    queryKey: ['transactions', org, filters],
    queryFn: () => getTransactionsAction(filters),
  })

  function handlePaginate(page: number) {
    const params = new URLSearchParams(searchParams)

    params.set('page', page.toString())

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Input placeholder="Buscar por título" className="max-w-lg" />
        <Button className="ml-auto">
          <CirclePlus className="size-4" />
          Nova transação
        </Button>
      </div>

      <ContainerContentTable>
        {data ? (
          <>
            <ContainerContentTableWrapper>
              <TransactionsList transactions={data.transactions} />
            </ContainerContentTableWrapper>
            <Pagination
              page={data.meta.page}
              perPage={data.meta.perPage}
              total={data.meta.total}
              onPageChange={handlePaginate}
            />
          </>
        ) : (
          'carregando...'
        )}
      </ContainerContentTable>
    </div>
  )
}
