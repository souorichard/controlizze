import { getCurrentOrganization } from '@/auth/auth'

import { CreateCategoryDialog } from './create-category-dailog'

export default async function CreateCategoryPage() {
  const currentOrganization = await getCurrentOrganization()

  return <CreateCategoryDialog organization={currentOrganization!} />
}
