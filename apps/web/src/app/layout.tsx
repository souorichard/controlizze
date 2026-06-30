import type { Metadata } from 'next'
import { Geist, Space_Grotesk } from 'next/font/google'
import './globals.css'
import '@/lib/dayjs'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { Providers } from './providers'

const spaceGroteskSans = Space_Grotesk({
  variable: '--font-space-grotesk-sans',
  subsets: ['latin'],
})

const geistSans = Geist({
  variable: '--font-geist-sans',
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
    <html
      lang="en"
      className={cn(
        'dark antialiased select-none',
        spaceGroteskSans.variable,
        geistSans.variable,
      )}
    >
      <body>
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
