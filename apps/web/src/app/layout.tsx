import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import '@/lib/dayjs'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Controlizze',
    template: '%s • Controlizze',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn('dark antialiased', geistSans.variable)}>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
