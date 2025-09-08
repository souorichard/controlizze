import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Calendar as CalendarIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

dayjs.extend(relativeTime)

interface DateRangePickerProps extends ComponentProps<'div'> {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'justify-start px-3 text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {dayjs(date.from).format('MMM DD, YYYY')} -{' '}
                  {dayjs(date.to).format('MMM DD, YYYY')}
                </>
              ) : (
                dayjs(date.from).format('MMM DD, YYYY')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            max={14}
            autoFocus
            mode="range"
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            defaultMonth={date?.from}
            // disabled={(day) => day > dayjs().toDate()}
            disabled={(day) => {
              const today = dayjs().toDate()

              // disable future days
              if (day > today) return true

              // disables days that would exceed 14 days if a "from" is already selected
              if (date?.from) {
                const maxDay = dayjs(date.from).add(14, 'day').toDate()
                return day > maxDay
              }

              return false
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
