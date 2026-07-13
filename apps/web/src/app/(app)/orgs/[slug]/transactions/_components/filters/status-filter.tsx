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
  { label: 'All status', value: 'all' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Canceled', value: 'CANCELED' },
]

const statusFilterSchema = z.object({
  status: z.string().optional(),
})

type StatusFilterFormData = z.infer<typeof statusFilterSchema>

export function StatusFilter() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const { status } = getTransactionsFilter(searchParams)

  const { watch, control } = useForm<StatusFilterFormData>({
    resolver: zodResolver(statusFilterSchema),
    defaultValues: {
      status: status ?? 'all',
    },
  })

  const isFirstRender = useRef(true)
  const searchParamsRef = useRef(searchParams)

  const selectedStatus = watch('status')

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const params = new URLSearchParams(searchParamsRef.current.toString())

    if (!selectedStatus || selectedStatus === 'all') {
      params.delete('status')
    } else {
      params.set('status', selectedStatus)
    }

    params.delete('page')
    replace(`${pathname}?${params.toString()}`)
  }, [selectedStatus, pathname, replace])

  return (
    <Controller
      control={control}
      name="status"
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
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
