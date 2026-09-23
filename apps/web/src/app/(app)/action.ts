'use server'

import { getOrgs } from '@/http/orgs/get-orgs'

export async function getOrgsAction() {
  const { orgs } = await getOrgs()

  return orgs
}
