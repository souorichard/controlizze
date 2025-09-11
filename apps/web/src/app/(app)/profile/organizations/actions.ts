'use server'

import { getOrganizations } from '@/http/organization/get-organizations'

export async function getOrganizationsAction() {
  const { organizations } = await getOrganizations()

  return { organizations }
}
