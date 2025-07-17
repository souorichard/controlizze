import './globals.css'

import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-mont-sans',
})

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
      <body className={`${montserrat.className} dark antialiased`}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  )
}
