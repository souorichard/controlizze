import type { Metadata } from 'next'
import { Geist, Space_Grotesk } from 'next/font/google'
import './globals.css'

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
    template: '%s | Controlizze',
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
      className={`${spaceGroteskSans.variable} ${geistSans.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
