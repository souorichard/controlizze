import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { VerifyEmailWrapper } from './_components/verify-email-wrapper'

export const metadata: Metadata = {
  title: 'Verify your email',
}

interface VerifyEmailPageProps {
  searchParams: Promise<{
    code: string
  }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { code } = await searchParams

  if (!code) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="h-screen p-10 flex justify-center items-center">
      <VerifyEmailWrapper code={code} />
    </div>
  )
}
