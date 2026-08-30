import { dayjs } from '@/lib/dayjs'

export function formatDate(date: string) {
  const day = dayjs(date).format('DD')
  const month = dayjs(date).format('MMMM')

  return `${day} ${month.charAt(0).toUpperCase()}${month.slice(1)}`
}

export function formatDateWithMonth({
  date,
  short,
}: {
  date: string
  short?: boolean
}) {
  const formatted = short
    ? dayjs(date).format('MMM')
    : dayjs(date).format('MMMM')

  return formatted[0].toUpperCase() + formatted.slice(1)
}
