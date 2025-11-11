'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod/v4'

import { Input } from '@/components/ui/input'

import { getCategoriesFilter } from './get-categories-filter'

const liveCategoryNameFilterSchema = z.object({
  name: z
    .string()
    .min(3, 'Category name must be at least 3 characters.')
    .or(z.literal(''))
    .optional(),
})

type LiveDescrLiptionFilterFormData = z.infer<
  typeof liveCategoryNameFilterSchema
>

export function LiveCategoryNameFilter() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const { name } = getCategoriesFilter(searchParams)

  const {
    watch,
    trigger,
    register,
    formState: { errors },
  } = useForm<LiveDescrLiptionFilterFormData>({
    resolver: zodResolver(liveCategoryNameFilterSchema),
    defaultValues: {
      name: name ?? '',
    },
  })

  const formCategoryName = watch('name')
  const [debouncedSearch] = useDebounce(formCategoryName, 500)

  useEffect(() => {
    async function updateUrl() {
      const params = new URLSearchParams(searchParams.toString())

      if (!formCategoryName) {
        params.delete('name')

        replace(`${pathname}?${params.toString()}`)

        return
      }

      const isValid = await trigger('name')

      if (!isValid) return

      if (debouncedSearch) {
        params.set('name', debouncedSearch)
      } else {
        params.delete('name')
      }

      params.delete('page')
      replace(`${pathname}?${params.toString()}`)
    }

    updateUrl()
  }, [debouncedSearch, pathname, replace, searchParams, trigger])

  return (
    <div className="w-full space-y-1.5">
      <Input placeholder="Search name..." {...register('name')} />
      {errors.name && (
        <span className="text-destructive block text-xs">
          {errors.name.message}
        </span>
      )}
    </div>
  )
}
