import dayjs from 'dayjs'
import type z from 'zod'
import type { frequencySchema } from './../../http/schemas/index.ts'

type Frequency = z.infer<typeof frequencySchema>

type CalculateNextExecutionDateParams = {
  date: Date
  frequency: Frequency
  interval: number
}

export function calculateNextExecutionDate({
  date,
  frequency,
  interval,
}: CalculateNextExecutionDateParams) {
  switch (frequency) {
    case 'DAILY':
      return dayjs(date).add(interval, 'day').toDate()

    case 'WEEKLY':
      return dayjs(date).add(interval, 'week').toDate()

    case 'MONTHLY':
      return dayjs(date).add(interval, 'month').toDate()

    case 'YEARLY':
      return dayjs(date).add(interval, 'year').toDate()
  }
}
