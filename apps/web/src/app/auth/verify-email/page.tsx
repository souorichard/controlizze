import type { Metadata } from 'next'
import { Suspense } from 'react'
import { VerifyEmailWrapper } from './_components/verify-email-wrapper'

export const metadata: Metadata = {
  title: 'Verifique seu email',
}

export default function VerifyEmailPage() {
  return (
    <div className="h-screen p-10 flex justify-center items-center">
      <Suspense>
        <VerifyEmailWrapper />
      </Suspense>
    </div>
  )
}
