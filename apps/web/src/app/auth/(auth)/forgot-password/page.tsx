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
          Esqueceu sua senha? <br /> Não se preocupe, vamos ajudar!
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Digite seu email e enviaremos um link para você criar uma nova senha.
        </p>
      </div>
      <div className="space-y-6">
        <ForgotPasswordForm />
        <p className="text-sm text-muted-foreground text-center">
          Lembrou sua senha?{' '}
          <Link
            href="/auth/sign-in"
            className="text-primary transition-colors hover:text-primary/85"
          >
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  )
}
