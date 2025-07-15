import './globals.css'

import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'

export const metadata: Metadata = {
  title: {
    default: 'Controlizze',
    template: '%s | Controlizze',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
