import { useQuery } from '@tanstack/react-query'
import type { ComponentProps } from 'react'
import { useOrg } from '@/hooks/use-org'
import { cn } from '@/lib/utils'
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
  mode?: 'filter' | 'form'
  className?: string
}

export function CategorySelect({
  mode = 'filter',
  className,
  ...props
}: CategorySelectProps) {
  const org = useOrg()

  const { data } = useQuery({
    queryKey: ['categories', org],
    queryFn: async () => getCategoriesAction(),
  })

  const categories = data?.categories ?? []

  return (
    <Select {...props}>
      <SelectTrigger className={cn('', className)}>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>

          {mode === 'filter' && (
            <SelectItem value="all">All categories</SelectItem>
          )}

          {categories?.map((category) => (
            <SelectItem
              key={category.id}
              value={mode === 'filter' ? category.slug : category.id}
            >
              <div
                style={{ backgroundColor: category.color }}
                className="size-2 rounded-full"
              />
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
