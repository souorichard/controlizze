'use client'

import { useQuery } from '@tanstack/react-query'
import { CircleAlert } from 'lucide-react'
import { ComponentProps } from 'react'

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
  type = 'EXPENSE',
  ...props
}: CategorySelectProps) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesAction,
  })

  const expenses = categories?.filter((category) => {
    return category.type === 'EXPENSE'
  })

  const revenues = categories?.filter((category) => {
    return category.type === 'REVENUE'
  })

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories?.length === 0 && (
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

        {type === 'EXPENSE' && (
          <SelectGroup>
            <SelectLabel>Expenses</SelectLabel>
            {expenses?.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}

        {type === 'REVENUE' && (
          <SelectGroup>
            <SelectLabel>Revenues</SelectLabel>
            {revenues?.map((category) => (
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
