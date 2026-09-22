import type { Metadata } from 'next'
import Link from 'next/link'
import { ForgotPasswordForm } from './_components/forgot-password-form'

export const metadata: Metadata = {
  title: 'Esqueci minha senha',
}

export default function ForgotPassowordPage() {
  return (
    <div className="max-w-lg w-full space-y-12">
      <div className="space-y-3">
        <h1 className="text-2xl font-medium font-heading tracking-wide md:text-4xl">
          Forgot your password? <br /> Don't worry, we got you!
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Enter your email and we'll send you a link to create a new password.
        </p>
      </div>
      <div className="space-y-6">
        <ForgotPasswordForm />
        <p className="text-sm text-muted-foreground text-center">
          Remember your password?{' '}
          <Link
            href="/auth/sign-in"
            className="text-primary transition-colors hover:text-primary/80"
          >
            Access it!
          </Link>
        </p>
      </div>
    </div>
  )
}
