'use server'

import { getCurrentOrganization } from '@/auth/auth'
import { getCategories } from '@/http/category/get-categories'

export async function getCategoriesAction() {
  const currentOrganization = await getCurrentOrganization()

  const { categories } = await getCategories({
    organization: currentOrganization!,
  })

  return {
    categories,
  }
}
