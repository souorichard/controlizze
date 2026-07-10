'use client'

import { CircleCheck, CircleX, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { verifyEmailAction } from '../actions'

interface VerifyEmailWrapperProps {
  code: string
}

export function VerifyEmailWrapper({ code }: VerifyEmailWrapperProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'success' | 'loading' | 'error'>(
    'loading',
  )

  useEffect(() => {
    const verifyEmailFunction = async () => {
      const { success } = await verifyEmailAction({ code })

      if (!success) {
        setStatus('error')
        return
      }

      setStatus('success')

      setTimeout(() => {
        router.push('/auth/sign-in')
      }, 2000)
    }

    verifyEmailFunction()
  }, [code, router])

  if (status === 'loading') {
    return (
      <div className="flex flex-col justify-center items-center gap-5">
        <Loader2 className="size-16 animate-spin text-primary" />

        <div className="max-w-xl w-full space-y-3 text-center">
          <h1 className="text-2xl font-medium font-heading tracking-wide">
            Verifying your email...
          </h1>
          <p className="text-muted-foreground">
            Please wait, we are verifying your email
          </p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col justify-center items-center gap-5">
        <CircleCheck className="size-16 text-green-500" />

        <div className="max-w-xl w-full space-y-3 text-center">
          <h1 className="text-2xl font-medium font-heading tracking-wide">
            Email verified successfully!
          </h1>
          <p className="text-muted-foreground">
            Please wait, you will be redirected to the login page
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <CircleX className="size-16 text-destructive" />

      <div className="max-w-xl w-full space-y-3 text-center">
        <h1 className="text-2xl font-medium font-heading tracking-wide">
          There was an error verifying your email
        </h1>
        <p className="text-muted-foreground">
          Please review the verification link and try again. If the problem
          persists, please contact support.
        </p>
      </div>
    </div>
  )
}
