import type { ReadonlyURLSearchParams } from 'next/navigation'

import { GetCategoriesActionProps } from '../../actions'

export function getCategoriesFilter(
  searchParams: ReadonlyURLSearchParams,
): GetCategoriesActionProps {
  const page = searchParams.get('page') ?? '1'
  const perPage = searchParams.get('perPage') ?? '10'

  const name = searchParams.get('name')
  const type = searchParams.get('type')

  const filters: GetCategoriesActionProps = { page, perPage }

  if (name) filters.name = name
  if (type) filters.type = type

  return filters
}
