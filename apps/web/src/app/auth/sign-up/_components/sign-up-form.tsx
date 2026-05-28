'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import type { Metadata } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ErrorMessage } from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '../actions'
import { type SignUpData, signUpSchema } from '../schemas'

export const metadata: Metadata = {
  title: 'Criar nova conta',
}

export function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function handleSignUp({
    name,
    email,
    password,
    confirmPassword,
  }: SignUpData) {
    const { success, message } = await signUp({
      name,
      email,
      password,
      confirmPassword,
    })

    if (!success) {
      toast.error(message)
      return
    }

    toast.success(message)

    router.push(`/auth/sign-in?email=${encodeURIComponent(email)}`)
  }

  return (
    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
      <div className="space-y-1">
        <Label>Nome</Label>
        <Input
          type="text"
          placeholder="John Doe"
          className="h-10"
          disabled={isSubmitting}
          {...register('name')}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="john@exemplo.com"
          className="h-10"
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Label>Senha</Label>
        <Input
          type="password"
          placeholder="Digite sua senha"
          className="h-10"
          disabled={isSubmitting}
          {...register('password')}
        />
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </div>

      <div className="space-y-2">
        <Label>Confirmar senha</Label>
        <Input
          type="password"
          placeholder="Digite sua senha novamente"
          className="h-10"
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-10"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <span>Criar minha conta</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  )
}
