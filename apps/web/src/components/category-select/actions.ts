'use server'

import { getCategories } from '@/http/categories/get-categories'
import { getCurrentOrg } from '@/utils/auth'

export async function getCategoriesAction() {
  const currentOrg = await getCurrentOrg()

  const { categories, meta } = await getCategories({
    org: currentOrg as string,
  })

  return {
    categories,
    meta,
  }
}
