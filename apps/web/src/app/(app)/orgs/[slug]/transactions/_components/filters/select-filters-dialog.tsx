'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Funnel, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod/v4'

import { CategorySelect } from '@/components/category-select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { getTransactionsFilter } from '../functions/get-transactions-filter'

const transactionsFilterSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
})

export type TransactionsFilterData = z.infer<typeof transactionsFilterSchema>

export function SelectFiltersDialog() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)

  const { type, category, status } = getTransactionsFilter(searchParams)

  const { watch, control, handleSubmit } = useForm<TransactionsFilterData>({
    resolver: zodResolver(transactionsFilterSchema),
    defaultValues: {
      type: type ?? 'EXPENSE',
      category: category ?? '',
      status: status ?? 'PENDING',
    },
  })

  function handleSetFilter({ type, category, status }: TransactionsFilterData) {
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

    setIsOpen(false)

    replace(`${pathname}?${params.toString()}`)
  }

  function handleClearFilter() {
    const params = new URLSearchParams(searchParams)

    params.delete('type')
    params.delete('category')
    params.delete('status')

    setIsOpen(false)

    replace(`${pathname}?${params.toString()}`)
  }

  const typeValue = watch('type') as 'EXPENSE' | 'REVENUE' | undefined

  const hasAnyPopoverFilter = !!(type || category || status)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full lg:ml-auto lg:w-auto">
          <Funnel className="size-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>
            Set the filters for your transactions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSetFilter)} className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="type">Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => {
                return (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                      <SelectItem value="REVENUE">Revenue</SelectItem>
                    </SelectContent>
                  </Select>
                )
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
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
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => {
                return (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
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
          </div>

          <div className="space-y-2">
            {hasAnyPopoverFilter && (
              <Button
                type="button"
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
