'use client'

import { useQuery } from '@tanstack/react-query'
import { CircleAlert } from 'lucide-react'
import { ComponentProps } from 'react'

import { useOrganization } from '@/hooks/use-organization'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { getCategoriesAction } from './actions'

interface CategorySelectProps extends ComponentProps<typeof Select> {
  className?: string
  type: 'EXPENSE' | 'REVENUE' | undefined
}

export function CategorySelect({
  className,
  type,
  ...props
}: CategorySelectProps) {
  const organization = useOrganization()

  const { data } = useQuery({
    queryKey: ['categories', organization, type],
    queryFn: getCategoriesAction,
  })

  const categories = data?.rawCategories.filter((category) => {
    return category.type === type
  })

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {data?.rawCategories.length === 0 && (
          <div className="flex items-center justify-center gap-2 p-2">
            <CircleAlert className="text-primary size-4" />
            <span className="text-sm">No categories.</span>
          </div>
        )}

        {type === undefined && (
          <div className="flex items-center justify-center gap-2 p-2">
            <CircleAlert className="text-primary size-4" />
            <span className="text-sm">Select type first</span>
          </div>
        )}

        {categories && (
          <SelectGroup>
            <SelectLabel>
              {type === 'EXPENSE' ? 'Expenses' : 'Revenues'}
            </SelectLabel>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  )
}
