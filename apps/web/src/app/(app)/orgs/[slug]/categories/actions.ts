'use server'

import { getCurrentOrganization } from '@/auth/auth'
import { getCategories } from '@/http/category/get-categories'

export interface GetCategoriesActionProps {
  page: string
  perPage?: string
  name?: string
  type?: string
}

export async function getCategoriesAction({
  page,
  // perPage,
  name,
  type,
}: GetCategoriesActionProps) {
  const currentOrganization = await getCurrentOrganization()

  const { categories, totalCount } = await getCategories({
    organization: currentOrganization!,
    page: page ?? '1',
    // perPage: perPage ?? '10',
    name,
    type,
  })

  return {
    categories,
    totalCount,
  }
}
