'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Funnel, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod/v4'

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

import { getCategoriesFilter } from './get-categories-filter'

const categoriesFilterSchema = z.object({
  type: z.string().optional(),
})

export type CategoriesFilterData = z.infer<typeof categoriesFilterSchema>

export function CategoriesFiltersDialog() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)

  const { type } = getCategoriesFilter(searchParams)

  const { control, handleSubmit } = useForm<CategoriesFilterData>({
    resolver: zodResolver(categoriesFilterSchema),
    defaultValues: {
      type: type ?? 'EXPENSE',
    },
  })

  function handleSetFilter({ type }: CategoriesFilterData) {
    const params = new URLSearchParams(searchParams)

    if (type) {
      params.set('type', type)
    } else {
      params.delete('type')
    }

    setIsOpen(false)

    replace(`${pathname}?${params.toString()}`)
  }

  function handleClearFilter() {
    const params = new URLSearchParams(searchParams)

    params.delete('type')

    setIsOpen(false)

    replace(`${pathname}?${params.toString()}`)
  }

  const hasAnyPopoverFilter = !!type

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
            Set the filters for your categories
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
