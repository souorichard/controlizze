import { dayjs } from '@/lib/dayjs'

export function formatDate(date: string) {
  const formatted = dayjs(date).format('DD [de] MMMM')

  return formatted.replace(/de (\w)/, (_, c) => `de ${c.toUpperCase()}`)
}

export function formatDateWithMonth(date: string) {
  const formatted = dayjs(date).format('MMM')

  return formatted[0].toUpperCase() + formatted.slice(1)
}
