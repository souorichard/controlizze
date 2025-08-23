import { ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const categories = {
  expenses: [
    { name: 'Housing' },
    { name: 'Utilities (water, electricity, internet)' },
    { name: 'Transportation' },
    { name: 'Food' },
    { name: 'Health' },
    { name: 'Education' },
    { name: 'Leisure and Entertainment' },
    { name: 'Subscriptions and Services' },
    { name: 'General Shopping' },
    { name: 'Debts and Loans' },
    { name: 'Investments' },
    { name: 'Others' },
  ],
  revenues: [
    { name: 'Salary' },
    { name: 'Freelance / Services' },
    { name: 'Own Business' },
    { name: 'Investments' },
    { name: 'Rentals' },
    { name: 'Refunds' },
    { name: 'Gifts / Donations received' },
    { name: 'Others' },
  ],
}

interface CategorySelectProps extends ComponentProps<typeof Select> {
  className?: string
  type: 'EXPENSE' | 'REVENUE' | undefined
}

export function CategorySelect({
  className,
  type,
  ...props
}: CategorySelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {type === undefined ? (
          <div className="flex items-center justify-center px-1.5 py-2">
            <span className="text-muted-foreground text-sm">
              Select a type first
            </span>
          </div>
        ) : (
          (type === 'EXPENSE' ? categories.expenses : categories.revenues).map(
            (category, index) => (
              <SelectItem key={index} value={category.name}>
                {category.name}
              </SelectItem>
            ),
          )
        )}
      </SelectContent>
    </Select>
  )
}
