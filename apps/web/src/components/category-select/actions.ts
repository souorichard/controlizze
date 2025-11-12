'use server'

import { getCurrentOrganization } from '@/auth/auth'
import { getCategories } from '@/http/category/get-categories'

export async function getCategoriesAction() {
  const currentOrganization = await getCurrentOrganization()

  const { rawCategories, categories } = await getCategories({
    organization: currentOrganization!,
  })

  return {
    rawCategories,
    categories,
  }
}
