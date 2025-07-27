'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    getValues,
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

  function handleForgotPassword(e: React.MouseEvent) {
    e.preventDefault()

    const email = getValues('email')

    if (!email) {
      toast.error('Please, enter your e-mail first.')

      return
    }

    router.push(`/auth/forgot-password?email=${email}`)
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
            placeholder="john@example.com"
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
            placeholder="••••••"
            {...register('password')}
          />

          {errors.password && (
            <span className="text-destructive block text-xs">
              {errors.password.message}
            </span>
          )}

          <Link
            href="/auth/sign-in"
            onClick={handleForgotPassword}
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

        <div className="flex items-center justify-center gap-1 py-2 text-sm">
          <span className="text-muted-foreground">Don't have an account?</span>
          <Link
            href="/auth/sign-up"
            className="underline-offset-4 transition hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>

      <Separator />

      <SocialSignInButtons disabled={isLoading} />
    </div>
  )
}
