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
            Verificando seu email...
          </h1>
          <p className="text-muted-foreground">
            Aguarde um momento, estamos verificando seu email
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
            Email verificado com sucesso!
          </h1>
          <p className="text-muted-foreground">
            Aguarde um momento, você será redirecionado para a página de login
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
          Ocorreu um erro ao verificar seu email
        </h1>
        <p className="text-muted-foreground">
          Reevie o link de verificação e tente novamente. Se o problema
          persistir, entre em contato com o suporte.
        </p>
      </div>
    </div>
  )
}
