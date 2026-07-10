import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Separator } from '@/components/ui/separator'
import { SocialLogins } from '../_components/social-logins'
import { SignInForm } from './_components/sign-in-form'

export const metadata: Metadata = {
  title: 'Access your account',
}

export default function SignInPage() {
  return (
    <div className="max-w-lg w-full space-y-12">
      <div className="space-y-3">
        <h1 className="text-4xl font-medium font-heading tracking-wide">
          Welcome back!
        </h1>
        <p className="text-muted-foreground">
          Access your account and continue to take control of your financial
          life
        </p>
      </div>
      <div className="space-y-6">
        <SocialLogins />
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">
            or continue with
          </span>
          <Separator className="flex-1" />
        </div>
        <Suspense>
          <SignInForm />
        </Suspense>
        <p className="text-sm text-muted-foreground text-center">
          Don't have an account?{' '}
          <Link
            href="/auth/sign-up"
            className="text-primary transition-colors hover:text-primary/85"
          >
            Create one!
          </Link>
        </p>
      </div>
    </div>
  )
}
