import { getOrgs } from '@/http/orgs/get-orgs'
import { getCurrentOrg } from '@/utils/auth'
import { OrganizationSwitcherClient } from './organization-switcher-client'

export async function OrganizationSwitcher() {
  const currentOrgByCookie = await getCurrentOrg()

  const { orgs } = await getOrgs()

  const currentOrg = orgs.find((org) => org.slug === currentOrgByCookie)

  return <OrganizationSwitcherClient currentOrg={currentOrg} orgs={orgs} />
}
