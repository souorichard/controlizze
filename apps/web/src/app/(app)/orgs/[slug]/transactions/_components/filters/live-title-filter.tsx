'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import z from 'zod'
import { ErrorMessage } from '@/components/error-message'
import { Input } from '@/components/ui/input'
import { getTransactionsFilter } from '@/utils/filters'

const liveTitleFilterSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters.')
    .or(z.literal(''))
    .optional(),
})

type LiveTitleFilterFormData = z.infer<typeof liveTitleFilterSchema>

export function LiveTitleFilter() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const { title } = getTransactionsFilter(searchParams)

  const {
    watch,
    trigger,
    register,
    formState: { errors },
  } = useForm<LiveTitleFilterFormData>({
    resolver: zodResolver(liveTitleFilterSchema),
    defaultValues: {
      title: title ?? '',
    },
  })

  const searchParamsRef = useRef(searchParams)

  const formTitle = watch('title')
  const [debouncedSearch] = useDebounce(formTitle ?? '', 500)

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  useEffect(() => {
    if (formTitle) return

    const params = new URLSearchParams(searchParamsRef.current.toString())

    params.delete('title')
    params.delete('page')

    replace(`${pathname}?${params.toString()}`)
  }, [pathname, replace, formTitle])

  useEffect(() => {
    if (!debouncedSearch) return

    async function updateSearchParams() {
      const isValid = await trigger('title')

      if (!isValid) return

      const params = new URLSearchParams(searchParamsRef.current.toString())

      params.set('title', debouncedSearch)
      params.delete('page')

      replace(`${pathname}?${params.toString()}`)
    }

    updateSearchParams()
  }, [debouncedSearch, pathname, replace, trigger])

  return (
    <div className="flex-1 space-y-2">
      <Input placeholder="Search by title..." {...register('title')} />
      {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
    </div>
  )
}
