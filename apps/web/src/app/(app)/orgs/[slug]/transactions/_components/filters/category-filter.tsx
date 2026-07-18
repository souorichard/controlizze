'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { CategorySelect } from '@/components/category-select'
import { getTransactionsFilter } from '@/utils/filters'

const categoryFilterSchema = z.object({
  category: z.string().optional(),
})

type CategoryFilterFormData = z.infer<typeof categoryFilterSchema>

export function CategoryFilter() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const { category } = getTransactionsFilter(searchParams)

  const { watch, control } = useForm<CategoryFilterFormData>({
    resolver: zodResolver(categoryFilterSchema),
    defaultValues: {
      category: category ?? 'all',
    },
  })

  const isFirstRender = useRef(true)
  const searchParamsRef = useRef(searchParams)

  const selectedCategory = watch('category')

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const params = new URLSearchParams(searchParamsRef.current.toString())

    if (!selectedCategory || selectedCategory === 'all') {
      params.delete('category')
    } else {
      params.set('category', selectedCategory)
    }

    params.delete('page')
    replace(`${pathname}?${params.toString()}`)
  }, [selectedCategory, pathname, replace])

  return (
    <Controller
      control={control}
      name="category"
      render={({ field }) => (
        <CategorySelect
          value={field.value}
          onValueChange={field.onChange}
          className="w-42"
        />
      )}
    />
  )
}
