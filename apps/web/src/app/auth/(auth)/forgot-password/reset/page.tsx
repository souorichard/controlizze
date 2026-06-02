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
        <h1 className="text-3xl font-medium font-heading tracking-wide">
          Redefina sua senha
        </h1>
        <p className="text-muted-foreground">
          Preencha o formulário abaixo para redefinir com sua nova senha e
          recupere o acesso à sua conta.
        </p>
      </div>
      <div className="space-y-6">
        <ResetPasswordForm code={code} />
      </div>
    </div>
  )
}
