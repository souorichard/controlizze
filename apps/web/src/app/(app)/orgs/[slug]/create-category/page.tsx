import { Metadata } from 'next'

import { getCurrentOrganization } from '@/auth/auth'
import { CategoryForm } from '@/components/category-form'

export const metadata: Metadata = {
  title: 'Categories: Create',
}

export default async function CreateCategoryPage() {
  const currentOrganization = await getCurrentOrganization()

  return (
    <>
      <h1 className="text-xl font-semibold md:text-2xl">Create category</h1>

      <CategoryForm organization={currentOrganization!} />
    </>
  )
}
