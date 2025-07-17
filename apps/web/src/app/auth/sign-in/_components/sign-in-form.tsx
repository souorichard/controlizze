'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { SocialSignInButtons } from '@/components/auth/social-sign-in-buttons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { signInWithPasswordAction } from '../actions'

const signInSchema = z.object({
  email: z.email({ error: 'Please, provide a valid e-mail.' }),
  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters.' }),
})

export type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  async function handleSignIn({ email, password }: SignInFormData) {
    const { success, message } = await signInWithPasswordAction({
      email,
      password,
    })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className="space-y-4 md:space-y-5"
      >
        <div className="space-y-1.5">
          <Label>E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@acme.com"
            {...register('email')}
          />

          {errors.email && (
            <span className="text-destructive block text-xs">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
          />

          {errors.password && (
            <span className="text-destructive block text-xs">
              {errors.password.message}
            </span>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-muted-foreground hover:text-foreground text-xs transition hover:underline hover:underline-offset-4"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Sign in with e-mail'
          )}
        </Button>

        <Button type="button" variant="link" className="w-full" asChild>
          <Link href="/auth/sign-up">Create a new account</Link>
        </Button>
      </form>

      <Separator />

      <SocialSignInButtons disabled={isLoading} />
    </div>
  )
}
