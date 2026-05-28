import type { Metadata } from 'next'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { SocialLogins } from '../_components/social-logins'
import { SignInForm } from './_components/sign-in-form'

export const metadata: Metadata = {
  title: 'Acesse sua conta',
}

export default function SignInPage() {
  return (
    <div className="max-w-lg w-full space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-medium font-heading tracking-wide">
          Bem-vindo de volta!
        </h1>
        <p className="text-muted-foreground">
          Acesse a sua conta e continue no controle da sua vida financeira
        </p>
      </div>
      <div className="space-y-6">
        <SocialLogins />
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">ou continue com</span>
          <Separator className="flex-1" />
        </div>
        <SignInForm />
        <p className="text-sm text-muted-foreground text-center">
          Ainda não tem uma conta?{' '}
          <Link
            href="/auth/sign-up"
            className="text-primary transition-colors hover:text-primary/85"
          >
            Crie uma!
          </Link>
        </p>
      </div>
    </div>
  )
}
