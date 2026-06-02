'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ErrorMessage } from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '../../_components/password-input'
import { signIn } from '../actions'
import { type SignInData, signInSchema } from '../schemas'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const email = searchParams.get('email') ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email,
      password: '',
    },
  })

  async function handleSignIn({ email, password }: SignInData) {
    const { success, message } = await signIn({
      email,
      password,
    })

    if (!success) {
      toast.error(message)
      return
    }

    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="john@exemplo.com"
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center gap-3">
          <Label>Senha</Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-primary transition-colors hover:text-primary/85"
          >
            Esqueceu sua senha?
          </Link>
        </div>
        <PasswordInput
          placeholder="• • • • • • • •"
          disabled={isSubmitting}
          {...register('password')}
        />
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Acessar minha conta
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  )
}
