import { ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface CategorySelectProps extends ComponentProps<typeof Select> {
  className?: string
}

export function CategorySelect({ className, ...props }: CategorySelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="food">Food</SelectItem>
      </SelectContent>
    </Select>
  )
}
