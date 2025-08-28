'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod/v4'

import { Input } from '@/components/ui/input'

import { getTransactionsFilter } from '../functions/get-transactions-filter'

const liveDescriptionFilterSchema = z.object({
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters.')
    .or(z.literal(''))
    .optional(),
})

type LiveDescrLiptionFilterFormData = z.infer<
  typeof liveDescriptionFilterSchema
>

export function LiveDescriptionFilter() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const { description } = getTransactionsFilter(searchParams)

  const {
    watch,
    trigger,
    register,
    formState: { errors },
  } = useForm<LiveDescrLiptionFilterFormData>({
    resolver: zodResolver(liveDescriptionFilterSchema),
    defaultValues: {
      description: description ?? '',
    },
  })

  const formDescription = watch('description')
  const [debouncedSearch] = useDebounce(formDescription, 500)

  useEffect(() => {
    async function updateUrl() {
      const params = new URLSearchParams(searchParams.toString())

      if (!formDescription) {
        params.delete('description')

        replace(`${pathname}?${params.toString()}`)

        return
      }

      const isValid = await trigger('description')

      if (!isValid) return

      if (debouncedSearch) {
        params.set('description', debouncedSearch)
      } else {
        params.delete('description')
      }

      params.delete('page')
      replace(`${pathname}?${params.toString()}`)
    }

    updateUrl()
  }, [debouncedSearch, pathname, replace, searchParams, trigger])

  return (
    <div className="space-y-1.5 lg:max-w-[500px] lg:flex-1">
      <Input placeholder="Search description..." {...register('description')} />
      {errors.description && (
        <span className="text-destructive block text-xs">
          {errors.description.message}
        </span>
      )}
    </div>
  )
}
