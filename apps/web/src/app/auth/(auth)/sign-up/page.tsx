import type { Metadata } from 'next'
import Link from 'next/link'
import { TypingText } from '@/components/typing-text'
import { Separator } from '@/components/ui/separator'
import { SocialLogins } from '../_components/social-logins'
import { SignUpForm } from './_components/sign-up-form'

export const metadata: Metadata = {
  title: 'Crie sua conta',
}

export default function SignUpPage() {
  return (
    <div className="max-w-lg w-full space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-medium font-heading tracking-wide">
          Controle financeiro <br /> simples, claro e{' '}
          <TypingText
            text="eficiente"
            speed={150}
            className="bg-linear-to-r from-primary via-primary/60 to-primary bg-clip-text text-transparent animate-shimmer"
          />
        </h1>
        <p className="text-muted-foreground">
          Organize suas finanças, acompanhe resultados em tempo real e tome
          decisões com segurança
        </p>
      </div>
      <div className="space-y-6">
        <SocialLogins />
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">
            ou com seu email
          </span>
          <Separator className="flex-1" />
        </div>
        <SignUpForm />
        <p className="text-sm text-muted-foreground text-center">
          Já tem uma conta?{' '}
          <Link
            href="/auth/sign-in"
            className="text-primary transition-colors hover:text-primary/85"
          >
            Acesse!
          </Link>
        </p>
      </div>
    </div>
  )
}
