'use client'

import { createContext, ReactNode } from 'react'

interface OrganizationContext {
  organization: string | null
}

export const OrganizationContext = createContext<
  OrganizationContext | undefined
>(undefined)

interface OrganizationProviderProps {
  children: ReactNode
  organization: string | null
}

export function OrganizationProvider({
  children,
  organization,
}: OrganizationProviderProps) {
  return (
    <OrganizationContext.Provider value={{ organization }}>
      {children}
    </OrganizationContext.Provider>
  )
}
