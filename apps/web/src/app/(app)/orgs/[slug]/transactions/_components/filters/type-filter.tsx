'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getTransactionsFilter } from '@/utils/filters'

const items = [
  { label: 'All types', value: 'all' },
  { label: 'Income', value: 'INCOME' },
  { label: 'Expense', value: 'EXPENSE' },
]

const typeFilterSchema = z.object({
  type: z.string().optional(),
})

type TypeFilterFormData = z.infer<typeof typeFilterSchema>

export function TypeFilter() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const { type } = getTransactionsFilter(searchParams)

  const { watch, control } = useForm<TypeFilterFormData>({
    resolver: zodResolver(typeFilterSchema),
    defaultValues: {
      type: type ?? 'all',
    },
  })

  const isFirstRender = useRef(true)
  const searchParamsRef = useRef(searchParams)

  const selectedType = watch('type')

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const params = new URLSearchParams(searchParamsRef.current.toString())

    if (!selectedType || selectedType === 'all') {
      params.delete('type')
    } else {
      params.set('type', selectedType)
    }

    params.delete('page')
    replace(`${pathname}?${params.toString()}`)
  }, [selectedType, pathname, replace])

  return (
    <Controller
      control={control}
      name="type"
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Types</SelectLabel>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  )
}
