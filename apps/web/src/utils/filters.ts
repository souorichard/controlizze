import type { ReadonlyURLSearchParams } from 'next/navigation'
import type { TransactionsFilter } from '@/interfaces/transaction'

export function getTransactionsFilter(
  searchParams: ReadonlyURLSearchParams,
): TransactionsFilter {
  const page = searchParams.get('page') ?? '1'
  const perPage = searchParams.get('perPage') ?? '10'

  const title = searchParams.get('title')
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const filters: TransactionsFilter = { page, perPage }

  if (title) filters.title = title
  if (type) filters.type = type
  if (status) filters.status = status
  if (category) filters.category = category
  if (startDate) filters.startDate = startDate
  if (endDate) filters.endDate = endDate

  return filters
}
