import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
  dialog: ReactNode
}

export default function AppLayout({ children, dialog }: AppLayoutProps) {
  return (
    <>
      {children}
      {dialog}
    </>
  )
}
