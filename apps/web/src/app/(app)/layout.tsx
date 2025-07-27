import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

import { isAuthenticated } from '@/auth/auth'

interface AppLayoutProps {
  children: ReactNode
  dialog: ReactNode
}

export default async function AppLayout({ children, dialog }: AppLayoutProps) {
  if (!(await isAuthenticated())) {
    redirect('/auth/sign-in')
  }

  return (
    <>
      {children}
      {dialog}
    </>
  )
}
