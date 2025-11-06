import { getCurrentOrganization } from '@/auth/auth'

import { CreateTransactionDialog } from './create-transaction-dialog'

export default async function CreateTransactionPage() {
  const currentOrganization = await getCurrentOrganization()

  return <CreateTransactionDialog organization={currentOrganization!} />
}
