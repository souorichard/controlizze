import { auth, getCurrentOrg } from '@/utils/auth'
import { AccountMenuClient } from './account-menu-client'

export async function AccountMenu() {
  const { user } = await auth()

  const currentOrg = await getCurrentOrg()

  return <AccountMenuClient user={user} currentOrg={currentOrg} />
}
