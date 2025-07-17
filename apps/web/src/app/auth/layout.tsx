import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { isAuthenticated } from '@/auth/auth'

export default async function AuthLayout({ children }: PropsWithChildren) {
  if (await isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-8 py-12">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="space-y-3 text-center">
          <h1 className="text-xl font-bold md:text-2xl">
            Take control of your finances
          </h1>
          <p className="text-muted-foreground text-sm font-medium text-pretty md:text-base">
            Join our system and simplify your financial life with ease and
            security
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
