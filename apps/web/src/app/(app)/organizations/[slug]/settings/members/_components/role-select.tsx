import { ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface RoleSelectProps extends ComponentProps<typeof Select> {
  className?: string
}

export function RoleSelect({ className, ...props }: RoleSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">ADMIN</SelectItem>
        <SelectItem value="MEMBER">MEMBER</SelectItem>
        <SelectItem value="BILLING">BILLING</SelectItem>
      </SelectContent>
    </Select>
  )
}
