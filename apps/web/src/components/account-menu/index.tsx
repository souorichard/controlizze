import { auth, getCurrentOrg } from '@/utils/auth'

import { AccountButton } from './account-button'

export async function AccountMenu() {
  const { user } = await auth()

  const currentOrg = await getCurrentOrg()

  return <AccountButton user={user} org={currentOrg} />
}
