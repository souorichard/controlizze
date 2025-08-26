import type { ReadonlyURLSearchParams } from 'next/navigation'

import { GetTransactionsActionProps } from '../../actions'

export function getTransactionsFilter(
  searchParams: ReadonlyURLSearchParams,
): GetTransactionsActionProps {
  const page = searchParams.get('page') ?? '1'
  const perPage = searchParams.get('perPage') ?? '10'

  const description = searchParams.get('description')
  const type = searchParams.get('type')
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  const filters: GetTransactionsActionProps = { page, perPage }

  if (description) filters.description = description
  if (type) filters.type = type
  if (category) filters.category = category
  if (status) filters.status = status

  return filters
}
