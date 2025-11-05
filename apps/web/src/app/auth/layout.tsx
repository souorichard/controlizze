import Image from 'next/image'
import { PropsWithChildren } from 'react'

import logo from '@/assets/brand/logo.svg'

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="bg-auth hidden flex-col bg-cover bg-bottom p-12 lg:flex lg:justify-between">
        <Image src={logo} alt="Controlizze logo" className="w-48" />

        <p className="text-muted-foreground text-end text-xs">
          Image designed by{' '}
          <a
            href="https://www.freepik.com"
            target="_blank"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Freepik
          </a>
        </p>
      </div>
      <div className="flex items-center justify-center px-8 py-12 lg:px-12">
        {children}
      </div>
    </div>
  )
}
