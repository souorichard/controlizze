'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Funnel, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod/v4'

import { CategorySelect } from '@/components/category-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const transactionsFiltersSchema = z.object({
  description: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
})

export type TransactionsFiltersData = z.infer<typeof transactionsFiltersSchema>

export function TransactionsFilter() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const description = searchParams.get('description')
  const type = searchParams.get('type')
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  const { watch, control, register, handleSubmit, reset } =
    useForm<TransactionsFiltersData>({
      resolver: zodResolver(transactionsFiltersSchema),
      defaultValues: {
        description: description ?? '',
        type: type ?? '',
        category: category ?? '',
        status: status ?? '',
      },
    })

  function handleSetFilter({
    description,
    type,
    category,
    status,
  }: TransactionsFiltersData) {
    const params = new URLSearchParams(searchParams)

    if (description) {
      params.set('description', description)
    } else {
      params.delete('description')
    }

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

    params.delete('description')
    params.delete('type')
    params.delete('category')
    params.delete('status')

    reset({
      description: '',
      type: '',
      category: '',
      status: '',
    })
  }

  const typeValue = watch('type') as 'EXPENSE' | 'REVENUE' | undefined

  const hasAnyFilter = !!(
    description ||
    type ||
    category ||
    status ||
    typeValue
  )

  return (
    <form
      onSubmit={handleSubmit(handleSetFilter)}
      className="flex w-full flex-col items-center gap-2 lg:flex-row"
    >
      <Input
        placeholder="Search description"
        className="lg:flex-1"
        {...register('description')}
      />

      <Controller
        control={control}
        name="type"
        render={({ field }) => {
          return (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full lg:w-[160px]">
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
              className="w-full lg:w-[220px]"
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
              <SelectTrigger className="w-full lg:w-[160px]">
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

      {hasAnyFilter && (
        <Button
          type="submit"
          variant="ghost"
          className="w-full lg:w-auto"
          onClick={handleClearFilter}
        >
          <X className="size-4" />
          Remove
        </Button>
      )}

      <Button type="submit" variant="secondary" className="w-full lg:w-auto">
        <Funnel className="size-4" />
        Apply
      </Button>
    </form>
  )
}
