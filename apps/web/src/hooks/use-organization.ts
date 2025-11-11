import { useContext } from 'react'

import { OrganizationContext } from '@/contexts/organization-context'

export function useOrganization() {
  const context = useContext(OrganizationContext)

  return context?.organization
}
