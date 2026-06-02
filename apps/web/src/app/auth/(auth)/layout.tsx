import Image from 'next/image'
import type { PropsWithChildren } from 'react'

import controlizzeLogo from '@/assets/brand/controlizze-logo.svg'

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen grid xl:grid-cols-2">
      <div className="p-10 hidden xl:flex flex-col justify-between bg-auth-hero bg-cover bg-bottom">
        <div>
          <Image
            src={controlizzeLogo}
            alt="Controlizze Logo"
            className="w-48"
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground text-end">
            Image by{' '}
            <a
              rel="noopener noreferrer"
              href="https://www.magnific.com"
              target="_blank"
              className="text-primary transition-colors hover:text-primary/85"
            >
              Magnific
            </a>
          </p>
        </div>
      </div>
      <div className="p-10 flex justify-center items-center">{children}</div>
    </div>
  )
}
