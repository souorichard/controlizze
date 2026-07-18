'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface StatusSelectProps extends ComponentProps<typeof Select> {
  mode?: 'filter' | 'form'
  className?: string
}

const items = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Canceled', value: 'canceled' },
]

export function StatusSelect({
  mode = 'filter',
  className,
  ...props
}: StatusSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className={cn('', className)}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>

          {mode === 'filter' && <SelectItem value="all">All status</SelectItem>}

          {items.map((item, i) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
