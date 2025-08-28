'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Funnel, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod/v4'

import { CategorySelect } from '@/components/category-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { getTransactionsFilter } from './functions/get-transactions-filter'

const transactionsFiltersSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
})

export type TransactionsFiltersData = z.infer<typeof transactionsFiltersSchema>

export function TransactionsFilter() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const { description, type, category, status } =
    getTransactionsFilter(searchParams)

  const [search, setSearch] = useState(description ?? '')
  const [debouncedSearch] = useDebounce(search, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedSearch) {
      params.set('description', debouncedSearch)
    } else {
      params.delete('description')
    }

    params.delete('page')

    replace(`${pathname}?${params.toString()}`)
  }, [debouncedSearch, pathname, replace])

  const { watch, control, handleSubmit, reset } =
    useForm<TransactionsFiltersData>({
      resolver: zodResolver(transactionsFiltersSchema),
      defaultValues: {
        type: type ?? '',
        category: category ?? '',
        status: status ?? '',
      },
    })

  function handleSetFilter({
    type,
    category,
    status,
  }: TransactionsFiltersData) {
    const params = new URLSearchParams(searchParams)

    if (type) {
      params.set('type', type)
    } else {
      params.delete('type')
    }

    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }

    replace(`${pathname}?${params.toString()}`)
  }

  function handleClearFilter() {
    const params = new URLSearchParams(searchParams)

    params.delete('type')
    params.delete('category')
    params.delete('status')

    reset({
      type: '',
      category: '',
      status: '',
    })
  }

  const typeValue = watch('type') as 'EXPENSE' | 'REVENUE' | undefined

  const hasAnyPopoverFilter = !!(type || category || status)

  return (
    <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search description"
        className="lg:max-w-[500px] lg:flex-1"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full lg:ml-auto lg:w-auto">
            <Funnel className="size-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Filters</h4>
              <p className="text-muted-foreground text-sm">
                Set the filters for your transactions.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleSetFilter)}
              className="grid gap-2"
            >
              <Controller
                control={control}
                name="type"
                render={({ field }) => {
                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="REVENUE">Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                  )
                }}
              />

              <Controller
                control={control}
                name="category"
                render={({ field }) => {
                  return (
                    <CategorySelect
                      value={field.value}
                      onValueChange={field.onChange}
                      type={typeValue}
                      className="w-full"
                    />
                  )
                }}
              />

              <Controller
                control={control}
                name="status"
                render={({ field }) => {
                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )
                }}
              />

              {hasAnyPopoverFilter && (
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full"
                  onClick={handleClearFilter}
                >
                  <X className="size-4" />
                  Remove
                </Button>
              )}

              <Button type="submit" className="w-full">
                <Funnel className="size-4" />
                Apply
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
