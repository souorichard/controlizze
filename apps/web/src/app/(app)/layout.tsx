import { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
  dialog: ReactNode
}

export default async function AppLayout({ children, dialog }: AppLayoutProps) {
  return (
    <>
      {children}
      {dialog}
    </>
  )
}
