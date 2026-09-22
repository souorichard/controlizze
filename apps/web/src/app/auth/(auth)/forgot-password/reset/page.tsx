import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ResetPasswordForm } from './_components/reset-password-form'

export const metadata: Metadata = {
  title: 'Esqueci minha senha',
}

interface ResetPassowordPageProps {
  searchParams: Promise<{
    code: string
  }>
}

export default async function ResetPassowordPage({
  searchParams,
}: ResetPassowordPageProps) {
  const { code } = await searchParams

  if (!code) {
    redirect('/auth/forgot-password')
  }

  return (
    <div className="max-w-lg w-full space-y-12">
      <div className="space-y-3">
        <h1 className="text-2xl font-medium font-heading tracking-wide md:text-4xl">
          Change your password <br /> and regain access to your account
        </h1>
        <p className="text-sm text-muted-foreground md-text-base">
          Fill out the form below to reset your password and regain access to
          your account.
        </p>
      </div>
      <div className="space-y-6">
        <ResetPasswordForm code={code} />
      </div>
    </div>
  )
}
